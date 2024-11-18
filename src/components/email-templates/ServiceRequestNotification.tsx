import { ServiceRequestSummary } from "@types";

type EmailTemplateProps = Pick<ServiceRequestSummary, 'service_category' | 'urgent' | 'created_at'>;

export default function ServiceRequestNotification(props: EmailTemplateProps) {
   return (
      <div>
         <h3>Heya! There's a new {props.urgent && "URGENT"} client service request waiting for you in the dashboard!</h3>
         <h4>Service Category: {props.service_category}</h4>
         <h4>Created on: {props.created_at}</h4>
      </div>
   );
}