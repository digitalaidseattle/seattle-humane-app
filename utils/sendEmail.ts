import { ReactNode } from 'react';
import { Resend } from 'resend';

export default async function sendEmail(
  resend: Resend,
  from: string,
  to: string,
  subject: string,
  body: ReactNode,
) {
  const { data, error } = await resend.emails.send({
    from, to, subject, react: body,
  });
  if (error) {
    throw new Error(error.message || 'Failed to send email');
  }
  return data;
}
