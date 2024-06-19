import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import * as dayjs from 'dayjs';

@Injectable()
export class LeadService {
  private headers = { Authorization: 'Bearer ' + process.env.AMOCRM_TOKEN };

  async getListOfLeads(query: string) {
    const leads = await this.getLeads(query);

    return this.generateListOfLeads(leads);
  }

  generateUrl(query: string): string {
    let url = `${process.env.AMOCRM_BASE_URL}/api/v4/leads?with=contacts`;
    if (query && query.trim().length > 3) {
      url += `&query=${query.trim()}`;
    }
    return url;
  }

  async getLeads(query: string) {
    const response = await fetch(this.generateUrl(query), {
      headers: this.headers,
    });
    if (response.status === 204) {
      return [];
    }
    const result = await response.json();
    return result['_embedded']['leads'];
  }

  async getStatuses() {
    const response = await fetch(
      `${process.env.AMOCRM_BASE_URL}/api/v4/leads/pipelines`,
      { headers: this.headers },
    );
    const result = await response.json();
    const pipelines = result['_embedded']['pipelines'];
    let statuses = [];
    for (const pipeline of pipelines) {
      statuses = pipeline['_embedded']['statuses'];
    }
    return statuses;
  }

  async getResponsibleUsers() {
    const response = await fetch(
      `${process.env.AMOCRM_BASE_URL}/api/v4/users`,
      { headers: this.headers },
    );
    const result = await response.json();
    return result['_embedded']['users'];
  }

  async getAllContacts() {
    const response = await fetch(
      `${process.env.AMOCRM_BASE_URL}/api/v4/contacts`,
      { headers: this.headers },
    );
    const result = await response.json();
    return result['_embedded']['contacts'];
  }

  async generateListOfLeads(leads: any) {
    const statuses = await this.getStatuses();
    const responsibleUsers = await this.getResponsibleUsers();
    const contacts = await this.getAllContacts();

    return leads.map((lead: any) => {
      const leadContacts = lead['_embedded']['contacts'];
      const leadContactIds = leadContacts.map((contact: any) => contact.id);
      const leadContactsData = contacts.filter((contact: any) =>
        leadContactIds.includes(contact.id),
      );

      return {
        key: lead.id,
        name: lead.name,
        price: lead.price,
        createdAt: this.formatDate(lead.created_at),
        responsibleUser: {
          id: lead.responsible_user_id,
          name: responsibleUsers.find(
            (user: any) => user.id === lead.responsible_user_id,
          ).name,
        },
        status: {
          id: lead.status_id,
          name: statuses.find((status: any) => status.id === lead.status_id)
            .name,
          color: statuses.find((status: any) => status.id === lead.status_id)
            .color,
        },
        contacts: this.getContactsForLead(leadContactsData),
      };
    });
  }

  getContactsForLead(leadContactsData: any) {
    return leadContactsData.map((contact: any) => {
      const customFields = contact.custom_fields_values;
      const phoneField = customFields.find(
        (field: any) => field.field_code === 'PHONE',
      );
      const emailField = customFields.find(
        (field: any) => field.field_code === 'EMAIL',
      );
      return {
        id: contact.id,
        name: contact.name,
        phones: phoneField?.values?.map((field: any) => {
          return { value: field.value };
        }),
        emails: emailField?.values?.map((field: any) => {
          return { value: field.value };
        }),
      };
    });
  }

  formatDate(date: number) {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
  }
}
