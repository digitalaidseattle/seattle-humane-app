import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import ServiceRequestNotification from '@components/email-templates/ServiceRequestNotification';
import { ServiceRequestSummary } from '@types';
import sendEmail from '@utils/sendEmail';

type RequestBody = {
  category: ServiceRequestSummary['service_category'],
  urgent: ServiceRequestSummary['urgent'],
  createdAt: ServiceRequestSummary['created_at'],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { category, urgent, createdAt }: RequestBody = req.body;
    if (!category || urgent === undefined || !createdAt) {
      return res.status(400).json({ error: 'Missing required fields: category, urgent, or createdAt.' });
    }
    const { RESEND_FROM_EMAIL, RESEND_TO_EMAIL, RESEND_API_KEY } = process.env;
    if (!RESEND_FROM_EMAIL || !RESEND_TO_EMAIL || !RESEND_API_KEY) {
      return res.status(500).json({ error: 'Env vars are not configured correctly.' });
    }
    const subject = `New ${urgent && '[Urgent]'} Service Request Notification`;
    const body = ServiceRequestNotification({ category, urgent, createdAt });
    const resend = new Resend(RESEND_API_KEY);
    const data = await sendEmail(resend, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, subject, body);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error processing request:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
