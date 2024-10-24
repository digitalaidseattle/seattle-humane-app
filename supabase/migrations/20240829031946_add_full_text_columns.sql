CREATE MATERIALIZED VIEW service_requests_search AS
SELECT 
      service_requests.id, 
      to_tsvector(concat_ws(
        ' ',
        service_requests.description, 
        service_requests.status, 
        clients.first_name, 
        clients.last_name, 
        clients.email, 
        team_members.first_name,
        team_members.last_name,
        team_members.email,
        pets.name,
        service_category.label,
        request_source.label
      )) as search_field
FROM
    service_requests
LEFT JOIN clients
    on  service_requests.client_id = clients.id
LEFT JOIN team_members
    on  service_requests.team_member_id = team_members.id
LEFT JOIN pets
    on  service_requests.pet_id = pets.id
LEFT JOIN app_constants service_category
    on  service_requests.service_category = service_category.id::text
LEFT JOIN app_constants request_source
    on  service_requests.request_source = request_source.id::text