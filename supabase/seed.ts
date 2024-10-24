/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import { faker } from '@faker-js/faker';
import { AppConstants } from 'src/constants';

// You can change the seed if you want, but there's no need to.
faker.seed(123);
// Create lots of seed data quickly
const DATA_MULTIPLIER = 1;
const NUM_FAKE_TEAM_MEMBERS = 40 * DATA_MULTIPLIER;
const NUM_FAKE_CLIENTS = 600 * DATA_MULTIPLIER;
const NUM_FAKE_PETS = 800 * DATA_MULTIPLIER;
const NUM_FAKE_TICKETS = 1000 * DATA_MULTIPLIER;
const DAYS_AGO_FIRST_SVC_REQ = 365 * DATA_MULTIPLIER;

const {
  number: { int: fakeInt },
  string: { uuid: fakeUUID },
  person: { firstName: fakeFirstName, lastName: fakeLastName },
  internet: { email: fakeEmail },
  location: { zipCode: fakeZipCode },
  phone: { number: fakePhone },
  lorem: { sentence: fakeSentence },
  date: { recent: fakeDate, past: fakeLongAgo },
} = faker;

/**
 * This utility function is used to select random clients/pets/app constants
 * when creating related data
*/
function getRandomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const appConstants: [string, string, string, string, string, number, number][] = [];
const appConstantsInput: [AppConstants, string[]][] = [
  // Feel free to add more types of app constants here
  [AppConstants.Species, ['Cat', 'Reptile', 'Dog']],
  [AppConstants.Source, ['Email', 'Phone Call']],
  [AppConstants.Category, ['Surgery', 'Vaccination']],
  [AppConstants.Status, ['Closed', 'Open']],
];

/**
 * We create the fake data add it to arrays.
 * Some of the data is relational, so we also keep track of
 * ids for appConstants, clients and pets to use when
 * creating related records
 */

/**
 * Fakes the creation date of the app constants.
 * Postgres to_timestamp expects seconds not miliseconds
 */
const appConstantsCreatedDate = fakeLongAgo().valueOf() / 1000;
const appConstantsIds: { [key: string]: string[] } = {};
appConstantsInput.forEach(([type, labels]) => {
  labels.forEach((label) => {
    const value = label.toLowerCase();
    const id = fakeUUID();
    appConstants.push([id, label, value, type, 'TRUE', appConstantsCreatedDate, appConstantsCreatedDate]);
    /**
     *  Keep track of the app constants' ids in an array, mapped by type
     * for later use in creating service requests
     */
    if (!appConstantsIds[type]) appConstantsIds[type] = [];
    appConstantsIds[type].push(id);
  });
});

const teamMembers: [string, string, string, string][] = [];
while (teamMembers.length < NUM_FAKE_TEAM_MEMBERS) {
  const fakeFirst = fakeFirstName();
  const fakeLast = fakeLastName();
  teamMembers.push([
    fakeUUID(),
    fakeFirst,
    fakeLast,
    fakeEmail({ firstName: fakeFirst, lastName: fakeLast, provider: 'seattlehumane.org' }),
  ]);
}
const clients: [string, string, string, string, string, string][] = [];
while (clients.length < NUM_FAKE_CLIENTS) {
  const fakeFirst = fakeFirstName();
  const fakeLast = fakeLastName();
  clients.push([
    fakeUUID(),
    fakeFirst,
    fakeLast,
    fakePhone(),
    fakeEmail({ firstName: fakeFirst, lastName: fakeLast }),
    fakeZipCode(),
  ]);
}
const pets: [string, string, string, string, string, string][] = [];
while (pets.length < NUM_FAKE_PETS) {
  pets.push([
    fakeUUID(),
    fakeFirstName(),
    `${fakeInt({ min: 1, max: 20 })}`,
    `${fakeInt({ min: 5, max: 50 })}`,
    getRandomItem(clients)[0],
    getRandomItem(appConstantsIds[AppConstants.Species]),
  ]);
}
const serviceRequests: [
  string, number, number, string, string, string,
  string, string, string, string, string,
][] = [];
while (serviceRequests.length < NUM_FAKE_TICKETS) {
  const pet = getRandomItem(pets);
  serviceRequests.push([
    fakeUUID(),
    fakeDate({ days: DAYS_AGO_FIRST_SVC_REQ, refDate: new Date() }).valueOf() / 1000,
    fakeDate({ days: DAYS_AGO_FIRST_SVC_REQ, refDate: new Date() }).valueOf() / 1000,
    fakeSentence(),
    pet[4], // owner id
    pet[0], // pet id
    getRandomItem(teamMembers)[0],
    getRandomItem(appConstantsIds[AppConstants.Category]),
    getRandomItem(appConstantsIds[AppConstants.Source]),
    getRandomItem(appConstantsIds[AppConstants.Status]),
    Math.random() * 10 >= 5 ? 'TRUE' : 'FALSE',
  ]);
}

/**
 * Next we convert the arrays into the format for a
 * .sql file. We log to the console then using a npm script
 * we cat that output to a seed.sql file.
 */

let table = 'app_constants';
console.log(`insert into ${table}
  (id, label, value, type, active, created_at, changed_at)
values`);
for (let i = 0; i < appConstants.length; i += 1) {
  const delim = (i + 1) === appConstants.length ? ';' : ',';
  const [id, label, value, type, active, created_at, changed_at] = appConstants[i];
  console.log(`('${id}'::UUID, '${label}', '${value}', '${type}', ${active}, to_timestamp(${created_at}), to_timestamp(${changed_at}))${delim}`);
}
table = 'team_members';
console.log(`
insert into ${table}
  (id, first_name, last_name, email)
values`);
for (let i = 0; i < teamMembers.length; i += 1) {
  const delim = (i + 1) === teamMembers.length ? ';' : ',';
  const [id, first, last, email] = teamMembers[i];
  // eslint-disable-next-line @typescript-eslint/quotes
  console.log(`('${id}'::UUID, '${first.replace(`'`, `''`)}', '${last.replace(`'`, `''`)}', '${email}')${delim}`);
}
table = 'clients';
console.log(`
insert into ${table}
  (id, first_name, last_name, phone, email, zip_code)
values`);
for (let i = 0; i < clients.length; i += 1) {
  const delim = (i + 1) === clients.length ? ';' : ',';
  const [id, first, last, phone, email, zip] = clients[i];
  // eslint-disable-next-line @typescript-eslint/quotes
  console.log(`('${id}'::UUID, '${first.replace(`'`, `''`)}', '${last.replace(`'`, `''`)}', '${phone}', '${email}', '${zip}')${delim}`);
}
table = 'pets';
console.log(`
insert into ${table}
  (id, name, age, weight, client_id, species)
values`);
for (let i = 0; i < pets.length; i += 1) {
  const delim = (i + 1) === pets.length ? ';' : ',';
  const [id, name, age, weight, client_id, species] = pets[i];
  // eslint-disable-next-line @typescript-eslint/quotes
  console.log(`('${id}'::UUID, '${name.replace(`'`, `''`)}', ${age}, ${weight}, '${client_id}'::UUID, '${species}'::UUID)${delim}`);
}
table = 'service_requests';
console.log(`
insert into ${table}
  (id, created_at, modified_at, description, client_id, pet_id,  team_member_id, service_category, request_source, status, urgent)
values`);
for (let i = 0; i < serviceRequests.length; i += 1) {
  const delim = (i + 1) === serviceRequests.length ? ';' : ',';
  const [
    id, date, modified_at, desc, client_id, pet_id, team_member_id, service_category,
    request_source, status, urgent] = serviceRequests[i];
  console.log(`('${id}'::UUID, to_timestamp(${date}), to_timestamp(${modified_at}), '${desc}', '${client_id}'::UUID, '${pet_id}'::UUID, '${team_member_id}'::UUID, '${service_category}'::UUID, '${request_source}'::UUID, '${status}'::UUID, ${urgent})${delim}`);
}
table = 'service_requests_search';
console.log(`REFRESH MATERIALIZED VIEW ${table}`);
