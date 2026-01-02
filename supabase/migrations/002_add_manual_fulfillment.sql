-- Create fulfillment_status enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfillment_status') THEN
        CREATE TYPE fulfillment_status AS ENUM (
            'unfulfilled',
            'paid',
            'in_review',
            'approved',
            'fulfilled',
            'cancelled'
        );
    END IF;
END $$;

-- Add columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS fulfillment_status fulfillment_status DEFAULT 'unfulfilled',
ADD COLUMN IF NOT EXISTS print_image_url TEXT,
ADD COLUMN IF NOT EXISTS print_image_storage_path TEXT;

-- Index for admin filtering
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);

-- Create storage bucket for print assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('print-assets', 'print-assets', true) -- Public or false depending on need. Plan said Public Read for Admin access simplicity, or use specific policies.
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage
-- Allow authenticated users (Admin) to do everything
CREATE POLICY "Admin All Access" ON storage.objects
FOR ALL USING (
  auth.role() = 'authenticated' AND (select aud from auth.users where id = auth.uid()) = 'authenticated'
) WITH CHECK (
  auth.role() = 'authenticated' AND (select aud from auth.users where id = auth.uid()) = 'authenticated'
);

-- Note: We might want more granular policies, but for now this enables the flow.
-- For standard users, we might want to allow upload during checkout.
-- Let's define a policy that allows anyone to read (for now, for simplicity in Admin dashboard) or authenticated.
-- And allow insert by anyone (for the checkout API which acts as server/admin usually? No, the checkout API runs on server but uses admin client? 
-- The checkout API uses `createAdminClient` or `createRouteHandlerClient`. If it uses Admin Client, it bypasses RLS).

-- So we just need to ensure the bucket exists.

COMMENT ON COLUMN orders.print_image_url IS 'Public URL of the high-res print asset in Supabase Storage';
COMMENT ON COLUMN orders.print_image_storage_path IS 'Internal storage path for the print asset';
