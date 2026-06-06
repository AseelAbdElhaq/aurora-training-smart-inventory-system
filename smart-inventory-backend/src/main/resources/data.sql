-- ROLES TABLE

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL
);

-- USERS TABLE

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
);

-- CATEGORIES TABLE

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    description TEXT
);

-- SUPPLIERS TABLE

CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    price DECIMAL(10,2),
    quantity INT DEFAULT 0,
    image_url TEXT,
    category_id INT,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id),

    CONSTRAINT fk_product_supplier
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id)
);

-- WAREHOUSES TABLE

CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    warehouse_name VARCHAR(255) NOT NULL,
    location TEXT,
    capacity INT,
    current_capacity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STOCK TABLE

CREATE TABLE IF NOT EXISTS stock (
    id SERIAL PRIMARY KEY,
    product_id INT,
    warehouse_id INT,
    quantity INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product
    FOREIGN KEY (product_id)
    REFERENCES products(id),

    CONSTRAINT fk_stock_warehouse
    FOREIGN KEY (warehouse_id)
    REFERENCES warehouses(id)
);

-- STOCK MOVEMENTS TABLE

CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INT,
    warehouse_id INT,
    movement_type VARCHAR(100),
    quantity INT,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    CONSTRAINT fk_movement_product
    FOREIGN KEY (product_id)
    REFERENCES products(id),

    CONSTRAINT fk_movement_warehouse
    FOREIGN KEY (warehouse_id)
    REFERENCES warehouses(id)
);

-- PURCHASE ORDERS TABLE

CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    supplier_id INT,
    status VARCHAR(100),
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchase_supplier
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id)
);

-- PURCHASE ORDER ITEMS TABLE

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),

    CONSTRAINT fk_purchase_order
    FOREIGN KEY (purchase_order_id)
    REFERENCES purchase_orders(id),

    CONSTRAINT fk_purchase_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
);

-- SALES ORDERS TABLE

CREATE TABLE IF NOT EXISTS sales_orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    status VARCHAR(100),
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SALES ORDER ITEMS TABLE

CREATE TABLE IF NOT EXISTS sales_order_items (
    id SERIAL PRIMARY KEY,
    sales_order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),

    CONSTRAINT fk_sales_order
    FOREIGN KEY (sales_order_id)
    REFERENCES sales_orders(id),

    CONSTRAINT fk_sales_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
);

-- ALERTS TABLE

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REPORTS TABLE

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    report_name VARCHAR(255),
    report_type VARCHAR(100),
    generated_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI INSIGHTS TABLE

CREATE TABLE IF NOT EXISTS ai_warehouse_suggestions (
    id SERIAL PRIMARY KEY,
    product_id INT,
    warehouse_id INT,
    prediction TEXT,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_product
    FOREIGN KEY (product_id)
    REFERENCES products(id),

    CONSTRAINT fk_ai_warehouse
    FOREIGN KEY (warehouse_id)
    REFERENCES warehouses(id)
);