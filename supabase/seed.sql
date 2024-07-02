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

insert into team_members
  (first_name, last_name, email)
values
  ('admin', 'admin', 'example@example.com');


-- supabase/seed.sql
--
-- create test users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        -- New column
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            -- New column
            id,
            format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );