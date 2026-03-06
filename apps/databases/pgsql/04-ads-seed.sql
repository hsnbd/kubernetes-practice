-- Seed data for ad campaigns

-- Productivity tools ads
INSERT INTO campaigns (id, title, description, product_url, image_url, keywords, active) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Boost Your Productivity with TaskMaster Pro',
    'All-in-one project management tool. Organize tasks, track time, and collaborate with your team. 30-day free trial!',
    'https://example.com/taskmaster-pro',
    'https://picsum.photos/seed/taskmaster/400/200',
    ARRAY['work', 'project', 'meeting', 'task', 'productivity'],
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'Meeting Scheduler - Calendar Integration',
    'Never miss a meeting again! Smart calendar that syncs across all devices. Schedule, remind, and join meetings effortlessly.',
    'https://example.com/meeting-scheduler',
    'https://picsum.photos/seed/meeting/400/200',
    ARRAY['meeting', 'work', 'calendar', 'schedule'],
    true
);

-- Shopping & retail ads
INSERT INTO campaigns (id, title, description, product_url, image_url, keywords, active) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'Amazon Prime Day - Up to 50% Off!',
    'Exclusive deals on electronics, home goods, and more. Free 2-day shipping with Prime membership.',
    'https://example.com/amazon-prime',
    'https://picsum.photos/seed/shopping/400/200',
    ARRAY['shopping', 'buy', 'purchase', 'store'],
    true
),
(
    '44444444-4444-4444-4444-444444444444',
    'Save Big on Groceries - Instacart',
    'Get your groceries delivered in as little as 1 hour. First delivery free!',
    'https://example.com/instacart',
    'https://picsum.photos/seed/groceries/400/200',
    ARRAY['shopping', 'grocery', 'food', 'buy'],
    true
);

-- Travel ads
INSERT INTO campaigns (id, title, description, product_url, image_url, keywords, active) VALUES
(
    '55555555-5555-5555-5555-555555555555',
    'Book Your Dream Vacation - Expedia',
    'Find the best deals on flights, hotels, and vacation packages. Save up to 40% when you bundle!',
    'https://example.com/expedia',
    'https://picsum.photos/seed/travel/400/200',
    ARRAY['travel', 'vacation', 'trip', 'flight', 'hotel'],
    true
),
(
    '66666666-6666-6666-6666-666666666666',
    'Airbnb Experiences - Unique Stays',
    'Stay in unique homes and experience local culture. Book your next adventure today!',
    'https://example.com/airbnb',
    'https://picsum.photos/seed/airbnb/400/200',
    ARRAY['travel', 'vacation', 'hotel', 'trip'],
    true
);

-- Health & fitness ads
INSERT INTO campaigns (id, title, description, product_url, image_url, keywords, active) VALUES
(
    '77777777-7777-7777-7777-777777777777',
    'Transform Your Body - Fitness+ Membership',
    'Access thousands of workout videos, personalized training plans, and nutrition guides. First month free!',
    'https://example.com/fitness-plus',
    'https://picsum.photos/seed/fitness/400/200',
    ARRAY['health', 'fitness', 'exercise', 'gym', 'workout'],
    true
),
(
    '88888888-8888-8888-8888-888888888888',
    'Healthy Meal Prep - HelloFresh',
    'Fresh ingredients and chef-designed recipes delivered to your door. Eat healthy without the hassle!',
    'https://example.com/hellofresh',
    'https://picsum.photos/seed/food/400/200',
    ARRAY['health', 'food', 'nutrition', 'cooking'],
    true
);

-- General productivity & lifestyle
INSERT INTO campaigns (id, title, description, product_url, image_url, keywords, active) VALUES
(
    '99999999-9999-9999-9999-999999999999',
    'Audiobooks for Busy People - Audible',
    'Listen to bestselling books while you commute, exercise, or relax. Free 30-day trial with 1 free book!',
    'https://example.com/audible',
    'https://picsum.photos/seed/books/400/200',
    ARRAY['reading', 'book', 'learning', 'education'],
    true
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Learn New Skills - Udemy Courses',
    'Master any skill with expert-led courses. Over 200,000 courses from programming to photography.',
    'https://example.com/udemy',
    'https://picsum.photos/seed/learning/400/200',
    ARRAY['learning', 'education', 'course', 'skill', 'work'],
    true
);
