

// This should reflect the shape of our SQL data. In this case I've chosen
// to keep naming conventions to SQL standards. Could add data mapper instead.
export type ClientType = {
  id?: BigInteger;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export type AnimalType = {
  id?: BigInteger;
  name: string;
  species: string;
  client_id?: BigInteger;
}