SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(255),
  name_pl VARCHAR(255),
  short_description_en TEXT,
  short_description_pl TEXT,
  full_description_en TEXT,
  full_description_pl TEXT,
  price DECIMAL(10, 2),
  image VARCHAR(255)
);

INSERT INTO products (name_en, name_pl, short_description_en, short_description_pl, full_description_en, full_description_pl, price, image)
VALUES
('Eagle', 'Orzeł', 'Eagle short description EN.', 'Orzeł krótki opis PL.', 'Eagle full description EN.', 'Orzeł pełny opis PL.', 99.99, 'product_1.jpg');

INSERT INTO products (name_en, name_pl, short_description_en, short_description_pl, full_description_en, full_description_pl, price, image)
VALUES
('Cat', 'Kotek', 'Cat short description EN.', 'Kotek krótki opis PL.', 'Cat full description EN.', 'Kotek pełny opis PL.', 287.12, 'product_2.jpg');

INSERT INTO products (name_en, name_pl, short_description_en, short_description_pl, full_description_en, full_description_pl, price, image)
VALUES
('Cow', 'Krowa', 'Cow short description EN.', 'Krowa krótki opis PL.', 'Cow full description EN.', 'Krowa pełny opis PL.', 30, 'product_3.jpg');

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

INSERT INTO users (username, email, hashed_password, role)
VALUES ('admin', 'admin@example.com', '$2b$12$jO7gGsTKWPlxnp93gGJD/OlWOB/yux/9Gkm8pX8WXLLl80ghxUrmi', 'admin');

INSERT INTO users (username, email, hashed_password, role)
VALUES ('user', 'user@example.com', '$2b$12$phJph9ZX.lOpj4iP4q4EVeKdjet9DYbGbNGhcb9kI.nmQLQxKN2l2', 'user');

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO comments (product_id, user_id, content, rating)
VALUES (1, 1, 'Amazing!', 5);

INSERT INTO comments (product_id, user_id, content, rating)
VALUES (1, 2, 'Not so cool :(', 2);

INSERT INTO comments (product_id, user_id, content, rating)
VALUES (3, 1, 'Taste wonderfull!', 5);