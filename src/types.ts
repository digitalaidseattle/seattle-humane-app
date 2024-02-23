
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
}

// INCOMPLETE: more fields to be added when confirmed as required
export type AnimalType = {
  id?: BigInteger;
  name: string;
  species: string;
  client_id?: BigInteger;
}

// INCOMPLETE: more fields to be added when confirmed as required
export type RequestType = {
  id?: BigInteger;
  client_id?: BigInteger;
  animal_id: BigInteger;
  service_category: string;
  source: string;
  staff_id: BigInteger;
}