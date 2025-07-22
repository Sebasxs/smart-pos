CREATE OR REPLACE FUNCTION create_invoice_transaction(
  p_customer JSONB,
  p_items JSONB,
  p_payment_method TEXT,
  p_subtotal BIGINT,
  p_discount BIGINT,
  p_total BIGINT
) RETURNS JSONB AS $$
DECLARE
  v_customer_id UUID;
  v_invoice_id INT;
  v_item JSONB;
  v_product_stock INT;
  v_product_cost INT;
  v_product_id UUID;
  v_item_id_text TEXT;
BEGIN
  -- A. Cliente: Buscar o Crear/Actualizar
  IF (p_customer->>'taxId') IS NOT NULL AND (p_customer->>'taxId') != '' THEN
    SELECT id INTO v_customer_id FROM customers WHERE tax_id = (p_customer->>'taxId');
    IF v_customer_id IS NOT NULL THEN
      UPDATE customers SET name = (p_customer->>'name'), email = (p_customer->>'email'), city = (p_customer->>'city') WHERE id = v_customer_id;
    ELSE
      INSERT INTO customers (name, tax_id, email, city, current_balance) VALUES ((p_customer->>'name'), (p_customer->>'taxId'), (p_customer->>'email'), (p_customer->>'city'), 0) RETURNING id INTO v_customer_id;
    END IF;
  ELSE
    v_customer_id := NULL;
  END IF;

  -- B. Factura
  INSERT INTO invoices (customer_id, payment_method, subtotal, discount, total, status, customer_snapshot)
  VALUES (v_customer_id, p_payment_method, p_subtotal, p_discount, p_total, 'paid', p_customer)
  RETURNING id INTO v_invoice_id;

  -- C. Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_item_id_text := (v_item->>'id');
    
    -- Manejo de inventario solo si el producto tiene ID (no es agregado manualmente)
    IF v_item_id_text IS NOT NULL AND v_item_id_text != '' THEN
       v_product_id := v_item_id_text::UUID;
       SELECT stock, COALESCE(cost, 0) INTO v_product_stock, v_product_cost FROM products WHERE id = v_product_id FOR UPDATE;
       
       IF v_product_stock IS NULL THEN 
         RAISE EXCEPTION 'El producto % ya no existe en el sistema', (v_item->>'name'); 
       END IF;
       
       -- Validar stock negativo opcionalmente, por ahora permitimos pero restamos
       UPDATE products SET stock = stock - (v_item->>'quantity')::INT WHERE id = v_product_id;
    ELSE
       v_product_id := NULL; 
       v_product_cost := 0;
    END IF;

    INSERT INTO invoice_items (
      invoice_id, product_id, product_name, quantity, 
      unit_price, total_price, 
      original_price, is_manual_price, is_manual_name,
      recorded_cost,
      discount_percentage
    ) VALUES (
      v_invoice_id,
      v_product_id,
      (v_item->>'name'),
      (v_item->>'quantity')::INT,
      (v_item->>'price')::BIGINT,
      ((v_item->>'price')::BIGINT * (v_item->>'quantity')::INT),
      COALESCE((v_item->>'originalPrice')::BIGINT, (v_item->>'price')::BIGINT),
      COALESCE((v_item->>'isManualPrice')::BOOLEAN, false),
      COALESCE((v_item->>'isManualName')::BOOLEAN, false),
      v_product_cost,
      COALESCE((v_item->>'discountPercentage')::SMALLINT, 0)
    );
  END LOOP;

  RETURN jsonb_build_object('success', true, 'invoice_id', v_invoice_id, 'message', 'Venta registrada correctamente');
EXCEPTION WHEN OTHERS THEN
  -- Revertir todo si algo falla
  RAISE EXCEPTION '%', SQLERRM;
END;
$$ LANGUAGE plpgsql;