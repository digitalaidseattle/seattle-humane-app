insert into app_constants
  (label, value, type, active, created_at, changed_at)
values
  ('Cat', 'cat', 'species', TRUE, now(), now()),
  ('Reptile', 'reptile', 'species', TRUE, now(), now()),
  ('Dog', 'dog', 'species', TRUE, now(), now());

insert into app_constants
  (label, value, type, active, created_at, changed_at)
values
  ('New', 'new', 'status', TRUE, now(), now()),
  ('In Progress', 'in-progress', 'status', TRUE, now(), now()),
  ('Blocked', 'blocked', 'status', TRUE, now(), now()),
  ('Closed', 'closed', 'status', TRUE, now(), now());

insert into app_constants
  (label, value, type, active, created_at, changed_at)
values
  ('Walk-In', 'walk-in', 'source', TRUE, now(), now()),
  ('Email', 'email', 'source', TRUE, now(), now()),
  ('Phone', 'phone', 'source', TRUE, now(), now());

insert into app_constants
  (label, value, type, active, created_at, changed_at)
values
  ('Adoption', 'adoption', 'category', TRUE, now(), now()),
  ('Fostering', 'fostering', 'category', TRUE, now(), now());
