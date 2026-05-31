CREATE DATABASE IF NOT EXISTS pak_travel;
USE pak_travel;

CREATE TABLE IF NOT EXISTS custom_tour_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    from_city VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    budget VARCHAR(50),
    travelers VARCHAR(20),
    duration VARCHAR(100),
    vehicle VARCHAR(100),
    hotel VARCHAR(100),
    food VARCHAR(100),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE DATABASE IF NOT EXISTS pak_travel;
USE pak_travel;

CREATE TABLE IF NOT EXISTS tour_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_name VARCHAR(150) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    cnic VARCHAR(50),
    travel_date DATE,
    guests INT DEFAULT 1,
    room_count INT DEFAULT 1,
    from_city VARCHAR(100),
    to_destination VARCHAR(100),
    route_text VARCHAR(255),
    hotel_package VARCHAR(100),
    hotel_name VARCHAR(150),
    vehicle VARCHAR(100),
    pickup_point VARCHAR(100),
    pickup_address TEXT,
    per_person_price DECIMAL(12,2) DEFAULT 0,
    hotel_price DECIMAL(12,2) DEFAULT 0,
    base_payment DECIMAL(12,2) DEFAULT 0,
    hotel_payment DECIMAL(12,2) DEFAULT 0,
    total_payment DECIMAL(12,2) DEFAULT 0,
    travelers_json LONGTEXT,
    booking_note TEXT,
    payment_type VARCHAR(50),
    payment_screenshot VARCHAR(255),
    status VARCHAR(80) DEFAULT 'Pending Admin Confirmation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS custom_tour_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    from_city VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    budget VARCHAR(50),
    travelers VARCHAR(20),
    duration VARCHAR(100),
    vehicle VARCHAR(100),
    hotel VARCHAR(100),
    food VARCHAR(100),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
USE pak_travel;

CREATE TABLE IF NOT EXISTS tour_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


USE pak_travel;
CREATE TABLE IF NOT EXISTS contact_inquiries (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 phone VARCHAR(30) NOT NULL,
 email VARCHAR(150),
 city VARCHAR(100),
 service VARCHAR(100),
 destination VARCHAR(150),
 travel_date DATE NULL,
 travelers VARCHAR(50),
 budget_range VARCHAR(100),
 hotel_type VARCHAR(100),
 message TEXT,
 status VARCHAR(50) DEFAULT 'New Inquiry',
 source VARCHAR(100) DEFAULT 'Contact Page',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


USE pak_travel;

CREATE TABLE IF NOT EXISTS university_trip_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leader_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    university_name VARCHAR(150) NOT NULL,
    department_name VARCHAR(150),
    trip_date DATE NULL,
    student_count INT NOT NULL,
    from_city VARCHAR(100),
    trip_package VARCHAR(150),
    destination VARCHAR(255),
    duration VARCHAR(80),
    stops_json LONGTEXT,
    vehicle VARCHAR(100),
    vehicle_capacity VARCHAR(100),
    stay_type VARCHAR(100),
    per_student_price DECIMAL(12,2) DEFAULT 0,
    discount DECIMAL(12,2) DEFAULT 0,
    total_payment DECIMAL(12,2) DEFAULT 0,
    pickup_point VARCHAR(100),
    pickup_address TEXT,
    special_note TEXT,
    payment_type VARCHAR(50),
    payment_screenshot VARCHAR(255) DEFAULT 'Not uploaded',
    status VARCHAR(80) DEFAULT 'Pending Admin Confirmation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);








Agar aap testing kar rahi ho aur IDs dobara:

1
2
3

se start karna chahti ho to phpMyAdmin me SQL tab open karo aur ye run karo:

TRUNCATE TABLE tour_bookings;

Ye:

pura table empty karega
IDs reset karega

Next entry phir:

1

se start hogi ✅

Custom tours ke liye:

TRUNCATE TABLE custom_tour_requests;

Users ke liye:

TRUNCATE TABLE tour_users;