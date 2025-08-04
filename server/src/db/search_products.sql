CREATE INDEX idx_products_name_trgm 
ON products 
USING gin (immutable_unaccent(name) gin_trgm_ops);

CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price BIGINT,
  cost BIGINT,
  stock INT,
  discount_percentage SMALLINT,
  supplier_name TEXT,
  supplier_id UUID,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  clean_term TEXT := immutable_unaccent(search_term);
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price::BIGINT,
    p.cost::BIGINT,
    p.stock,
    COALESCE(p.discount_percentage, 0)::SMALLINT,
    COALESCE(s.name, 'Sin proveedor'),
    p.supplier_id,
    p.created_at
  FROM products p
  LEFT JOIN suppliers s ON p.supplier_id = s.id
  WHERE 
    immutable_unaccent(p.name) ILIKE '%' || clean_term || '%'
    OR
    similarity(immutable_unaccent(p.name), clean_term) > 0.1
  ORDER BY 
    similarity(immutable_unaccent(p.name), clean_term) DESC,
    p.name ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;