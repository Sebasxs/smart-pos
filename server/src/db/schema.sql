-- Document type codes reference (DIAN Colombia):
-- '31' = NIT (default)
-- '13' = Cédula de Ciudadanía (CC)
-- '22' = Cédula de Extranjería (CE)
-- '41' = Pasaporte
-- '12' = Tarjeta de Identidad (TI)
-- '91' = Número de Identificación del Extranjero sin Pasaporte
-- '42' = Documento de Identificación Extranjero
CREATE TYPE document_type_enum AS ENUM ('31', '13', '22', '41', '12', '91', '42');
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  tax_id text,
  document_type document_type_enum NOT NULL DEFAULT '31',
  city text,
  created_at timestamp with time zone DEFAULT now(),
  current_balance bigint NOT NULL DEFAULT 0,
  phone text,
  address text,
  total_spent bigint DEFAULT 0,
  last_purchase_date timestamp with time zone,
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  invoice_id integer,
  product_id uuid,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price bigint NOT NULL,
  total_price bigint NOT NULL,
  original_price bigint DEFAULT 0,
  is_price_edited boolean DEFAULT false,
  is_name_edited boolean DEFAULT false,
  recorded_cost integer DEFAULT 0,
  discount_percentage smallint DEFAULT 0,
  CONSTRAINT invoice_items_pkey PRIMARY KEY (id),
  CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id),
  CONSTRAINT invoice_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.invoices (
  id integer NOT NULL DEFAULT nextval('invoices_invoice_number_seq'::regclass),
  customer_id uuid,
  customer_snapshot jsonb,
  subtotal bigint NOT NULL,
  discount bigint,
  total bigint NOT NULL,
  payment_method text CHECK (payment_method = ANY (ARRAY['cash'::text, 'transfer'::text])),
  status USER-DEFINED DEFAULT 'paid'::invoice_status,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price bigint NOT NULL,
  cost bigint,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  supplier_id uuid,
  discount_percentage smallint DEFAULT 0,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
);
CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  phone text,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);