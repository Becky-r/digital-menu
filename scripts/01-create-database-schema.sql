-- Creating core database schema for digital menu system
-- Categories table for menu organization
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_it VARCHAR(100),
    name_am VARCHAR(100),
    description_en TEXT,
    description_it TEXT,
    description_am TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name_en VARCHAR(200) NOT NULL,
    name_it VARCHAR(200),
    name_am VARCHAR(200),
    description_en TEXT,
    description_it TEXT,
    description_am TEXT,
    price_usd DECIMAL(10,2) NOT NULL,
    price_eur DECIMAL(10,2),
    price_etb DECIMAL(10,2),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    preparation_time INTEGER DEFAULT 15, -- in minutes
    calories INTEGER,
    -- Dietary information
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    is_halal BOOLEAN DEFAULT false,
    is_dairy_free BOOLEAN DEFAULT false,
    -- Allergen information
    contains_nuts BOOLEAN DEFAULT false,
    contains_dairy BOOLEAN DEFAULT false,
    contains_seafood BOOLEAN DEFAULT false,
    contains_eggs BOOLEAN DEFAULT false,
    contains_soy BOOLEAN DEFAULT false,
    contains_gluten BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables for restaurant seating
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(10) UNIQUE NOT NULL,
    qr_code VARCHAR(100) UNIQUE,
    capacity INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES restaurant_tables(id),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending', -- pending, preparing, ready, delivered, cancelled
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
    payment_method VARCHAR(50),
    special_instructions TEXT,
    estimated_ready_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    customizations JSONB, -- Store customizations like size, toppings, etc.
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customization options table
CREATE TABLE IF NOT EXISTS customization_options (
    id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    option_type VARCHAR(50) NOT NULL, -- size, topping, side, etc.
    name_en VARCHAR(100) NOT NULL,
    name_it VARCHAR(100),
    name_am VARCHAR(100),
    price_modifier DECIMAL(10,2) DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
