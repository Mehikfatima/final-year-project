USE pak_travel;

CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(80) NOT NULL,
    image TEXT,
    publish_date VARCHAR(80),
    read_time VARCHAR(50),
    excerpt TEXT,
    body LONGTEXT,
    tags TEXT,
    status VARCHAR(50) DEFAULT 'Published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Complete Guide to Planning a Northern Pakistan Tour', 'destination',
'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop',
'May 2026', '5 min read',
'Choose destination, budget, hotels, route, season and travel style before booking a northern Pakistan tour.',
'Northern Pakistan has many beautiful destinations including Hunza, Skardu, Naran Kaghan, Swat, Chitral and Fairy Meadows. Before booking, decide your total budget, travel dates, number of travelers, hotel category, transport type and weather season. Families should prefer easy routes like Hunza, Swat and Naran. Adventure lovers can choose Skardu, Chitral and Fairy Meadows. Always check road conditions, hotel availability and weather before final confirmation.',
'hunza,skardu,naran,family,budget', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Complete Guide to Planning a Northern Pakistan Tour');

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Best Time to Visit Skardu for Families and Couples', 'family',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
'May 2026', '4 min read',
'Skardu is perfect for families, honeymoon couples and adventure travelers during the summer season.',
'The best time to visit Skardu is usually from May to October because roads are more accessible and weather is pleasant. Families can enjoy Shangrila, Upper Kachura Lake, Katpana Desert and nearby viewpoints. Couples can choose lake-view hotels and private transport. Adventure travelers may include Deosai if road and weather conditions allow.',
'skardu,family,hotels', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Best Time to Visit Skardu for Families and Couples');

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Budget Tour Planning: How to Save Money on Pakistan Trips', 'budget',
'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
'April 2026', '3 min read',
'Use group tours, standard hotels and smart route planning to reduce travel expenses.',
'Budget travelers should compare group tours and private tours before booking. Group tours are usually cheaper because transport and hotel costs are shared. Choose standard hotels instead of luxury hotels, avoid peak dates when prices are high, and confirm what is included in the package. Always ask about transport, hotel, tolls, fuel, jeep charges and meal policy.',
'budget,hotels,family', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Budget Tour Planning: How to Save Money on Pakistan Trips');

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Hunza Travel Guide: Lakes, Forts and Mountain Views', 'destination',
'https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1200&auto=format&fit=crop',
'April 2026', '5 min read',
'Hunza is famous for Attabad Lake, Passu Cones, Karimabad, forts and peaceful mountain views.',
'Hunza is one of the most popular destinations in Pakistan. Main attractions include Attabad Lake, Passu Cones, Baltit Fort, Altit Fort, Eagle Nest and Karimabad Bazaar. The route is scenic and suitable for families, students and groups. For better comfort, choose 4 to 6 days depending on your starting city.',
'hunza,family,destination', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Hunza Travel Guide: Lakes, Forts and Mountain Views');

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Hotel Booking Tips for Travel Websites and Tour Customers', 'hotels',
'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
'March 2026', '4 min read',
'Hotel selection should include room count, family needs, parking, location and price category.',
'Before booking hotels, travelers should check room count, bed type, family privacy, parking, heating, hot water, breakfast, and distance from main attractions. Travel websites should allow customers to select hotel category and number of rooms so payment can be calculated more accurately.',
'hotels,family,budget', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Hotel Booking Tips for Travel Websites and Tour Customers');

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Fairy Meadows Adventure Tour: Camping and Hiking Guide', 'adventure',
'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop',
'March 2026', '5 min read',
'Fairy Meadows is best for adventure lovers who enjoy jeep rides, hiking, camping and mountain views.',
'Fairy Meadows is an adventure destination and requires careful planning. The trip includes road travel, jeep ride, hiking and camping. It is not as easy as Murree or Swat, so travelers should be physically prepared. Carry warm clothes, comfortable shoes, torch, power bank and personal medicine.',
'adventure,budget', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Fairy Meadows Adventure Tour: Camping and Hiking Guide');

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Naran Kaghan Family Tour: Lakes, Rivers and Meadows', 'family',
'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
'February 2026', '4 min read',
'Naran Kaghan is a beautiful family destination with Saif-ul-Malook, Kunhar River and Babusar Top.',
'Naran Kaghan is ideal for families during summer. Tourists enjoy Saif-ul-Malook Lake, Kunhar River, Lalazar, Babusar Top and scenic road views. Families should select comfortable transport and hotels near Naran Bazaar for easy access to food and shopping.',
'naran,family,hotels', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Naran Kaghan Family Tour: Lakes, Rivers and Meadows');

INSERT INTO blog_posts (title, category, image, publish_date, read_time, excerpt, body, tags, status)
SELECT 'Chitral Cultural Tour: Kalash Valley and Shandur Pass', 'destination',
'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
'February 2026', '4 min read',
'Chitral is famous for Kalash culture, mountain routes, Garam Chashma and Shandur Pass.',
'Chitral is a unique cultural and adventure destination. Kalash Valley is famous for traditions, colorful lifestyle and cultural heritage. Garam Chashma is known for natural hot springs, while Shandur Pass is famous for its high-altitude polo ground. This tour is suitable for culture lovers and adventure travelers.',
'adventure,family', 'Published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title='Chitral Cultural Tour: Kalash Valley and Shandur Pass');
