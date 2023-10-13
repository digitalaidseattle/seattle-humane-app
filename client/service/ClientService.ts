
import getConfig from 'next/config';

class ClientRequest {
  ticket: string;
  type: 'walk-in' | 'email' | 'phone' | 'other'
  email: string;
  phone: string;
  summary: string;
  description: string;
  date: Date;
  representative: string;

  constructor(data: any) {
    this.ticket = data.ticket;
    this.type = data.type;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.description = data.description;
    this.representative = data.representative
    this.date = new Date();
  }
}

class ClientService {
  contextPath: string;

  constructor() {
    this.contextPath = getConfig().publicRuntimeConfig.contextPath;
  }

  saveRequest(request: ClientRequest) {
    console.log('request = ', request);

  }
  getTickets() {
    return Promise.resolve([]);
    // return fetch(this.contextPath + '/demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
    //   .then((res) => res.json())
    //   .then((d) => d.data);
  }
}

const clientService = new ClientService();
export { ClientRequest, clientService };