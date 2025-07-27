CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  price BIGINT,
  stock INT,
  supplier TEXT,
  "discountPercentage" SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.price::BIGINT,
    p.stock,
    COALESCE(s.name, 'Genérico'),
    COALESCE(p.discount_percentage, 0)::SMALLINT
  FROM products p
  LEFT JOIN suppliers s ON p.supplier_id = s.id
  WHERE 
    unaccent(p.name) ILIKE '%' || unaccent(search_term) || '%'
    OR
    similarity(unaccent(p.name), unaccent(search_term)) > 0.1
  ORDER BY 
    similarity(unaccent(p.name), unaccent(search_term)) DESC,
    p.name ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;