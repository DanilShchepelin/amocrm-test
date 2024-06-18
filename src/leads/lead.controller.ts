import { Controller, Get, Query } from '@nestjs/common';
import { LeadService } from '@src/leads/lead.service';

@Controller()
export class LeadController {
  constructor(private readonly appService: LeadService) {}

  @Get('leads')
  getListOfLeads(@Query('query') query: string) {
    return this.appService.getListOfLeads(query);
  }
}
