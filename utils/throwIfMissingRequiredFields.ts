import { ClientType, ServiceRequestType, PetType } from '@types';

const requiredInputFields: {
  client: (keyof ClientType)[];
  animal: (keyof PetType)[];
  ticket: (keyof ServiceRequestType)[];
} = {
  client: ['first_name', 'last_name', 'email', 'phone'],
  animal: ['name', 'age', 'weight', 'species'],
  ticket: ['service_category', 'request_source', 'team_member_id'],
};

export default function throwIfMissingRequiredFields(
  type: 'client' | 'animal' | 'ticket',
  data: any,
) {
  const missingFields = [];
  const fields = requiredInputFields[type];
  fields.forEach((field) => {
    if (!data[field]) missingFields.push(field);
  });
  if (missingFields.length) throw new Error(`Cannot create the ${type} as the following information was missing: ${missingFields.join(',')}`);
  return true;
}
