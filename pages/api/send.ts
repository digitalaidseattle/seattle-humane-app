import ServiceRequestNotification from '@components/email-templates/ServiceRequestNotification';
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const { RESEND_FROM_EMAIL } = process.env;
const { RESEND_TO_EMAIL } = process.env;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== 'POST'){
  //    return res.status(405).json({erorr:"Method not allowed. use POST."});
  // }
  try {
    req.body = { category: 'vaccination', urgent: true, createdAt: '10/10/2024' };
    const { category, urgent, createdAt } = req.body;
    if (!category || urgent === undefined || !createdAt) {
      return res.status(400).json({ error: 'Missing required fields: service_category, urgent, or created_at.' });
    }

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: RESEND_TO_EMAIL,
      subject: `New ${urgent && '[Urgent]'} Service Request Notification`,
      react: ServiceRequestNotification({ category, urgent, createdAt }),
    });

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Error processing request:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
