-- Scout Analytics Database Schema
-- Version: 1.0.0

CREATE DATABASE IF NOT EXISTS scout_analytics;
USE scout_analytics;

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
    region_id INT PRIMARY KEY AUTO_INCREMENT,
    region_code VARCHAR(10) UNIQUE NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    store_id INT PRIMARY KEY AUTO_INCREMENT,
    store_name VARCHAR(200) NOT NULL,
    region_id INT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(region_id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(100) NOT NULL,
    parent_company VARCHAR(200),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    brand_id INT,
    category_id INT,
    uom VARCHAR(50),
    srp DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Transaction header table
CREATE TABLE IF NOT EXISTS transaction_header (
    txn_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id INT,
    txn_timestamp DATETIME NOT NULL,
    total_amount DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    INDEX idx_txn_timestamp (txn_timestamp),
    INDEX idx_store_date (store_id, txn_timestamp)
);

-- Transaction items table
CREATE TABLE IF NOT EXISTS transaction_item (
    txn_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    txn_id BIGINT,
    product_id INT,
    qty INT NOT NULL,
    gross_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (txn_id) REFERENCES transaction_header(txn_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    INDEX idx_txn_product (txn_id, product_id)
);

-- Analytics summary table for performance
CREATE TABLE IF NOT EXISTS analytics_summary (
    summary_id INT PRIMARY KEY AUTO_INCREMENT,
    summary_date DATE NOT NULL,
    region_id INT,
    total_sales DECIMAL(15, 2),
    transaction_count INT,
    unique_stores INT,
    avg_transaction_value DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(region_id),
    UNIQUE KEY unique_date_region (summary_date, region_id)
);

-- Create views for common queries
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
    DATE(th.txn_timestamp) as sales_date,
    COUNT(DISTINCT th.txn_id) as transaction_count,
    COUNT(DISTINCT th.store_id) as active_stores,
    SUM(ti.gross_amount) as total_sales,
    AVG(ti.gross_amount) as avg_transaction_value
FROM transaction_header th
JOIN transaction_item ti ON th.txn_id = ti.txn_id
GROUP BY DATE(th.txn_timestamp);

CREATE OR REPLACE VIEW regional_performance AS
SELECT 
    r.region_name,
    COUNT(DISTINCT s.store_id) as store_count,
    COUNT(DISTINCT th.txn_id) as transaction_count,
    SUM(ti.gross_amount) as total_sales
FROM regions r
LEFT JOIN stores s ON r.region_id = s.region_id
LEFT JOIN transaction_header th ON s.store_id = th.store_id
LEFT JOIN transaction_item ti ON th.txn_id = ti.txn_id
GROUP BY r.region_id, r.region_name;

-- Indexes for performance
CREATE INDEX idx_txn_header_date ON transaction_header(txn_timestamp);
CREATE INDEX idx_txn_item_amount ON transaction_item(gross_amount);
CREATE INDEX idx_product_brand ON products(brand_id);
CREATE INDEX idx_store_region ON stores(region_id);