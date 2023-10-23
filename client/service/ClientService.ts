
import getConfig from 'next/config';

enum RequestType {
  clientNew = 'client-new',
  clientUpdate = 'client-new',
  animalNew = 'animal-new',
  animalUpdate = 'animal-update'
}
enum TicketType {
  walkin = 'walk-in',
  email = 'email',
  phone = 'phone',
  other = 'other'
}

class NewClientRequest {
  requestType: RequestType = RequestType.clientNew;
  ticketNo: string;
  type: TicketType;
  name: string;
  email: string;
  phone: string;
  summary: string;
  description: string;
  date: Date;
  representative: string;

  constructor(data: any) {
    this.ticketNo = data.ticketNo;
    this.type = data.type;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.description = data.description;
    this.representative = data.representative
    this.date = data.date ? data.date : new Date();
  }
}

class ClientTicket {
  ticketNo: string;
  status: string;
  name: string;

  constructor(data: any) {
    this.ticketNo = data.ticketNo;
    this.name = data.name;
    this.status = data.status;
  }
}

class ClientService {
  contextPath: string;

  // TODO remove when in prod
  tickets: ClientTicket[] = [];

  constructor() {
    this.contextPath = getConfig().publicRuntimeConfig.contextPath;
  }

  newRequest(request: NewClientRequest): Promise<ClientTicket> {
    // TODO post request
    // For now...
    const ticket = new ClientTicket({
      name: request.name
    })
    this.tickets.push(ticket);
    return Promise.resolve(ticket);
  }

  getTickets(): Promise<ClientTicket[]> {
    return Promise.resolve(this.tickets);
    // return fetch(this.contextPath + '/demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
    //   .then((res) => res.json())
    //   .then((d) => d.data);
  }
}

const clientService = new ClientService();
export { NewClientRequest, clientService, TicketType };