import ClientService from '@services/ClientService';
import { ClientSchema } from '@types';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  clients: ClientSchema[]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const clients = await ClientService.getClients();
  res.status(200).json({ clients });
}
