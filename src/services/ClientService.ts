
/**
 *  ClientService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { v4 as uuidv4 } from 'uuid';
import supabaseClient from '../../utils/supabaseClient';
import { ClientType } from '../types';

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


class ServiceCategory {
  id: string
  name: string

  constructor(input: any) {
    this.id = input.id;
    this.name = input.name;
  }
}

class ServiceStatus {
  id: string
  code: string
  name: string

  constructor(input: any) {
    this.id = input.id;
    this.code = input.code;
    this.name = input.name;
  }
}
const statuses: ServiceStatus[] = [
  new ServiceStatus({ name: 'New', code: 'new' }),
  new ServiceStatus({ name: 'In-progress', code: 'update' }),
  new ServiceStatus({ name: 'Close', code: 'closed' }),
  new ServiceStatus({ name: 'Blocked', code: 'blocked' })
];

class NewClientRequest {
  requestType: RequestType = RequestType.clientNew;
  ticketNo: string;
  type: TicketType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  summary: string;
  description: string;
  date: Date;
  representative: string;

  constructor(data: any) {
    this.ticketNo = data.ticketNo;
    this.type = data.type;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.description = data.description;
    this.representative = data.representative
    this.date = data.date ? data.date : new Date();
  }
}

class UpdateClientRequest {
  requestType: RequestType = RequestType.clientUpdate;
  ticketNo: string;
  ticket: ClientTicket;
  date: Date;
  representative: string;

  constructor(ticket: any, date: Date, representative: string) {
    this.ticketNo = ticket.ticketNo;
    this.ticket = ticket;
    this.date = date ? date : new Date();
  }
}


class ChangeLog {
  date: Date;
  representative: string;
  description: string;

  constructor(data: any) {
    this.date = data.date ? data.date : new Date();
    this.description = data.description;
    this.representative = data.representative
  }
}

class ClientTicket {
  ticketNo: string;
  type: TicketType;
  status: string;
  firstName: string;
  lastName: string;
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
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.status = data.status;
    this.urgency = data.urgency;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.description = data.description;
    this.serviceCategoryId = data.serviceCategoryId;
  }
}

class ClientService {
  // constructor(private supabaseClient: SupabaseClient) { }

  // TODO remove when in prod
  tickets: ClientTicket[] = [
    new ClientTicket({ ticketNo: '1234', type: 'email', name: 'John Doe' })
  ];

  async newRequest(request: NewClientRequest): Promise<ClientTicket> {
    // Post Request to supabase
    try {
      const { data, error } = await supabaseClient
        .from('clients')
        .insert([{ 
          first_name: request.firstName, 
          last_name: request.lastName,
          email: request.email,
        }])
      if (error) throw error;
    } catch (error) { 
      console.log('ERROR AT NEW CLIENT REQUEST:', error);
      throw error;
    }
    // For now...
    const ticket = new ClientTicket(request)
    ticket.ticketNo = uuidv4();
    ticket.status = RequestType.clientNew;
    ticket.changeLog.push(new ChangeLog({
      date: request.date,
      representative: 'FIXME',
      description: 'New Request'
    }));

    this.tickets.push(ticket);
    return Promise.resolve(ticket);
  }

  async getClientByEmail(email: string): Promise<ClientType> {
    try {
      const { data, error } = await supabaseClient
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.log('ERROR IN GET CLIENT BY EMAIL:', error)
        throw error;
      }

      if (!data) throw new Error('No client found with this email')
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  getTicket(id: string): Promise<ClientTicket> {
    return Promise.resolve(this.tickets.find(t => t.ticketNo == id));
  }

  getTickets(): Promise<ClientTicket[]> {
    return Promise.resolve(this.tickets);
    // return fetch(this.contextPath + '/demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
    //   .then((res) => res.json())
    //   .then((d) => d.data);
  }

  update(ticket: ClientTicket): Promise<ClientTicket> {
    this.tickets = this.tickets.map(obj => ticket.ticketNo === obj.ticketNo ? ticket : obj);
    return Promise.resolve(this.tickets.find(t => t.ticketNo == ticket.ticketNo));
  }



  async getServiceStatuses(): Promise<ServiceStatus[]> {
    // REVIEW: Could be from DB
    return Promise.resolve(statuses)
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    // For Testing without DB
    // const tempCategories: ServiceCategory[] = [
    //   new ServiceCategory({ id: 'id_1', name: 'Cat One' }),
    //   new ServiceCategory({ id: 'id_2', name: 'Cat Two' }),
    //   new ServiceCategory({ id: 'id_3', name: 'Dog Adoption' }),
    //   new ServiceCategory({ id: 'id_4', name: 'Pet Fostering' })
    // ]
    // return Promise.resolve(tempCategories);

    const response = await supabaseClient
      .from('service_category')
      .select('*')
    return response.data
  }
}

const clientService = new ClientService();
export {
  ClientTicket,
  NewClientRequest,
  ServiceCategory,
  ServiceStatus,
  TicketType,
  clientService
};
