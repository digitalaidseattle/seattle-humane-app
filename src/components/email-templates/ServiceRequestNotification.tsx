import { ServiceRequestSummary } from '@types';

interface EmailTemplateProps {
  category: ServiceRequestSummary['service_category'],
  urgent: ServiceRequestSummary['urgent'],
  createdAt: ServiceRequestSummary['created_at']
}

export default function ServiceRequestNotification(
  { category, urgent, createdAt }: EmailTemplateProps,
) {
  return (
    <div>
      <h3>
        Heya! There&apos;s a new
        {urgent && 'URGENT'}
        {' '}
        client service request waiting for you in the dashboard!
      </h3>
      <h4>
        Service Category:
        {category}
      </h4>
      <h4>
        Created on:
        {createdAt}
      </h4>
    </div>
  );
}
