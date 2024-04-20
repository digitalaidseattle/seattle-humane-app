import { ChangeLog, TicketType } from '@lib';

export default class ClientTicket {
  ticketNo: string;

  type: TicketType;

  status: string;

  name: string;

  email: string;

  phone: string;

  summary: string;

  description: string;

  urgency: number;

  changeLog: ChangeLog[] = [];

  serviceCategoryId: string;

  constructor(data: any) {
    this.ticketNo = data.ticketNo;
    this.type = data.type;
    this.name = data.name;
    this.status = data.status;
    this.urgency = data.urgency;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.description = data.description;
    this.serviceCategoryId = data.serviceCategoryId;
  }
}
