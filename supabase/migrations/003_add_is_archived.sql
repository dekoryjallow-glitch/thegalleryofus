-- Add is_archived column to orders table
ALTER TABLE orders 
ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;

-- Index for performance on filtering
CREATE INDEX idx_orders_is_archived ON orders(is_archived);
