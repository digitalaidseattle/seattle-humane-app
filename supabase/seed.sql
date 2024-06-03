insert into app_constants
  (label, value, type, active, created_at, changed_at)
values
  ('Cat', 'cat', 'species', TRUE, now(), now()),
  ('Reptile', 'reptile', 'species', TRUE, now(), now()),
  ('Dog', 'dog', 'species', TRUE, now(), now()),
  ('Email', 'email', 'source', TRUE, now(), now()),
  ('Phone Call', 'phone call', 'source', TRUE, now(), now()),
  ('Surgery', 'surgery', 'category', TRUE, now(), now()),
  ('Vaccination', 'vaccination', 'category', TRUE, now(), now());