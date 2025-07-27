CREATE OR REPLACE FUNCTION search_customers(search_term TEXT)
RETURNS TABLE (
  city text,
  created_at timestamptz,
  current_balance float8,
  email text,
  id uuid,
  name text,
  tax_id text
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.city, c.created_at, c.current_balance, c.email, c.id, c.name, c.tax_id
  FROM customers c
  WHERE 
    unaccent(c.name) ILIKE '%' || unaccent(search_term) || '%'
    OR unaccent(c.tax_id) ILIKE '%' || unaccent(search_term) || '%'
    OR unaccent(c.email) ILIKE '%' || unaccent(search_term) || '%'
  ORDER BY
    similarity(unaccent(c.name), unaccent(search_term)) DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;