BEGIN
   -- triggered when inoice created
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE customers
    SET 
      total_spent = COALESCE(total_spent, 0) + NEW.total,
      last_purchase_date = NEW.created_at
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;