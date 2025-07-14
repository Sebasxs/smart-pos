
  select *
  from customers
  where name ilike '%' || search_term || '%'
     or tax_id ilike '%' || search_term || '%'
     or email ilike '%' || search_term || '%'
  limit 10;
