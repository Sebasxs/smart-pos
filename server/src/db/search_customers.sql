CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;

CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
RETURNS text AS $$
  SELECT public.unaccent('unaccent', $1)
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;

CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
RETURNS text AS $$
  SELECT public.unaccent('unaccent', $1)
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT SET search_path = public, extensions;

CREATE INDEX IF NOT EXISTS idx_customers_search_trgm 
ON customers 
USING gin (immutable_unaccent(name || ' ' || COALESCE(email, '') || ' ' || COALESCE(tax_id, '')) gin_trgm_ops);

CREATE OR REPLACE FUNCTION search_customers(search_term TEXT)
RETURNS TABLE (
  city text,
  created_at timestamptz,
  current_balance int8,
  email text,
  id uuid,
  name text,
  tax_id text,
  phone text,
  address text,
  total_spent int8,
  last_purchase_date timestamptz
) AS $$
DECLARE
  clean_term TEXT := immutable_unaccent(search_term);
BEGIN
  RETURN QUERY
  SELECT 
    c.city, 
    c.created_at, 
    c.current_balance, 
    c.email, 
    c.id, 
    c.name, 
    c.tax_id,
    c.phone,
    c.address,
    c.total_spent,
    c.last_purchase_date
  FROM customers c
  WHERE 
    immutable_unaccent(c.name || ' ' || COALESCE(c.email, '') || ' ' || COALESCE(c.tax_id, '')) 
    ILIKE '%' || clean_term || '%'
  ORDER BY 
    similarity(immutable_unaccent(c.name), clean_term) DESC,
    c.name ASC
  LIMIT 15;
END;
$$ LANGUAGE plpgsql;