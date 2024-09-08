import { ServiceRequestSummary } from '@types';
import { ColumnFilterElementTemplateOptions } from 'primereact/column';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

/* ---------------------- BODY TEMPLATES ---------------------- */

export function OwnerAndPetBodyTemplate({
   client, pet, id, urgent,
}: ServiceRequestSummary) {
   return (
      <div key={id}>
         <div className={`font-bold ${urgent ? 'text-red-500' : 'text-gray-900'}`}>{pet}</div>
         <div className={`capitalize ${urgent ? 'text-red-300' : 'text-gray-600'}`}>{client}</div>
      </div>
   );
}

export function CreatedAtBodyTemplate({ created_at, id }) {
   return (
      <span key={id}>
         {new Date(created_at).toLocaleDateString('en-US', {
            day: '2-digit', month: '2-digit', year: 'numeric',
         })}
      </span>
   );
}

export function TeamMemberBodyTemplate({ id, team_member }: ServiceRequestSummary) {
   return (
      <span key={id}>
         {team_member.first_name}
      </span>
   );
}

export function UrgentBodyTemplate({ urgent }: ServiceRequestSummary) {
   return (
      <div>
         {urgent ? 'Urgent' : ''}
      </div>
   );
}
