-- Seed data for development and testing

-- Insert test users (passwords are 'password123')
INSERT INTO users (id, email, password_hash, name) VALUES
('11111111-1111-1111-1111-111111111111', 'alice@example.com', '$2a$10$AFL202GvQGVdAES/UBf4F.vm3PyzgSPYRFz7YVFeF9TjESlXg2owO', 'Alice Johnson'),
('22222222-2222-2222-2222-222222222222', 'bob@example.com', '$2a$10$AFL202GvQGVdAES/UBf4F.vm3PyzgSPYRFz7YVFeF9TjESlXg2owO', 'Bob Smith')
ON CONFLICT (email) DO NOTHING;

-- Insert categories for Alice
INSERT INTO categories (id, user_id, name, color) VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Work', '#3b82f6'),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Personal', '#10b981'),
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Shopping', '#f59e0b')
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert categories for Bob
INSERT INTO categories (id, user_id, name, color) VALUES
('66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'Projects', '#8b5cf6'),
('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'Home', '#ec4899')
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert tags for Alice
INSERT INTO tags (id, user_id, name) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'urgent'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'meeting'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'research')
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert tags for Bob
INSERT INTO tags (id, user_id, name) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'important'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'review')
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert sample todos for Alice
INSERT INTO todos (id, user_id, category_id, title, description, completed, due_date, priority) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Complete project proposal', 'Write and submit the Q1 project proposal', FALSE, CURRENT_TIMESTAMP + INTERVAL '3 days', 1),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Book dentist appointment', 'Schedule annual checkup', FALSE, CURRENT_TIMESTAMP + INTERVAL '7 days', 0),
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Buy groceries', 'Milk, eggs, bread, vegetables', FALSE, CURRENT_TIMESTAMP + INTERVAL '1 day', 0),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Review team performance', 'Quarterly performance reviews', TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days', 1)
ON CONFLICT DO NOTHING;

-- Insert sample todos for Bob
INSERT INTO todos (id, user_id, category_id, title, description, completed, due_date, priority) VALUES
('b5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Deploy new feature', 'Deploy user authentication to production', FALSE, CURRENT_TIMESTAMP + INTERVAL '2 days', 1),
('b6666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'Fix leaky faucet', 'Call plumber or DIY', FALSE, CURRENT_TIMESTAMP + INTERVAL '5 days', 0)
ON CONFLICT DO NOTHING;

-- Associate tags with todos
INSERT INTO todo_tags (todo_id, tag_id) VALUES
('a1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('a1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('a4444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('b5555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd')
ON CONFLICT DO NOTHING;

-- Create a shared todo (Alice shares with Bob)
INSERT INTO todo_shares (todo_id, owner_id, shared_with_id, can_edit) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', TRUE)
ON CONFLICT DO NOTHING;
