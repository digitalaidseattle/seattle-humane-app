import ServiceRequestNotification from "@components/email-templates/ServiceRequestNotification";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_TO_EMAIL = process.env.RESEND_TO_EMAIL;

export default async (req: NextApiRequest, res: NextApiResponse) => {
   if (req.method !== 'POST'){
      return res.status(405).json({erorr:"Method not allowed. use POST."});
   }
   try {
      req.body = { service_category: 'vaccination', urgent: true, created_at: '10/10/2024' };
      const { service_category, urgent, created_at } = req.body;
      if (!service_category || urgent === undefined || !created_at) {
         return res.status(400).json({ error: "Missing required fields: service_category, urgent, or created_at." });
      }

      const { data, error } = await resend.emails.send({
         from: RESEND_FROM_EMAIL,
         to: RESEND_TO_EMAIL,
         subject: `New ${urgent && "[Urgent]"} Service Request Notification`,
         react: ServiceRequestNotification({ service_category, urgent, created_at }),
      });

      if (error) {
         return res.status(400).json(error);
      }

      return res.status(200).json(data);
   } catch (err) {
      console.error("Error processing request:", err);
      return res.status(500).json({ error: "Internal server error." });
   }
}