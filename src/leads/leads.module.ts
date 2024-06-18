import { Module } from '@nestjs/common';
import { LeadController } from '@src/leads/lead.controller';
import { LeadService } from '@src/leads/lead.service';

@Module({
  imports: [],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadsModule {}
