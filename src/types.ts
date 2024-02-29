
// MAIN DATA TYPES
// Current approach is to keep Domain models and Database models the same. If/when
// they diverge, we can create separate types for each and use a mapping function
// ID's are optional as they are not known until the data is persisted in DB

// INCOMPLETE: more fields to be added when confirmed as required
export type ClientType = {
  id?: BigInteger;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  postalCode: string;
  previously_used: string;
}
export type EdiableClientInfo = Omit<ClientType, 'id'>

// INCOMPLETE: more fields to be added when confirmed as required
export type AnimalType = {
  id?: BigInteger;
  name: string;
  species: string;
  breed: string;
  weight: string;
  client_id?: BigInteger;
}
export type EditableAnimalType = Omit<AnimalType, 'id'|'client_id'>

// INCOMPLETE: more fields to be added when confirmed as required
export type RequestType = {
  id?: BigInteger;
  client_id?: BigInteger;
  animal_id: BigInteger;
  service_category: string;
  priority: string;
  source: string;
  description: string;
  status: string;
  staff_id: BigInteger;
}
// TODO use lookup with assignedTo
export type EditableRequestType = Omit<RequestType, 'id'|'animal_id'|'staff_id'> & { assingedTo: string }

