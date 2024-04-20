import {
  AnimalSchemaInsert, AppConstantSchemaInsert, ClientSchemaInsert, ServiceRequestSchemaInsert,
} from '@types';
import { AppConstantTypes } from '@lib';

const testTimeStamp = (new Date()).toISOString();
export const testRequestInput: ServiceRequestSchemaInsert = {
  client_id: '',
  created_at: testTimeStamp,
  description: 'Request description',
  log_id: '',
  pet_id: '',
  request_source_id: '',
  service_category_id: '',
  team_member_id: '',
};
export const testClientInput: ClientSchemaInsert = {
  email: 'sh-test@digitalseattle.org',
  first_name: 'John',
  last_name: 'Smith',
  phone: '5555555555',
  postal_code: '55555',
  previously_used: 'false',
};
export const testSpeciesInput: AppConstantSchemaInsert = {
  type: AppConstantTypes.Species,
  label: 'Dog',
  value: 'dog',
  active: true,
  changed_at: testTimeStamp,
  created_at: testTimeStamp,
  changed_by: '',
};
export const testAnimalInput: AnimalSchemaInsert = {
  age: 5,
  name: 'Sparky',
  species_id: '',
  weight: 15,
};
