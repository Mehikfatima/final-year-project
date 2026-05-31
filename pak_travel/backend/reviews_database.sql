USE pak_travel;

CREATE TABLE IF NOT EXISTS traveler_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tour VARCHAR(150) NOT NULL,
    review_text TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    status VARCHAR(50) DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
