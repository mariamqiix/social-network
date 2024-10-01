/// data to add to the database if we recreate it

-- Insert Images (dummy BLOB data)
INSERT INTO ImageTable (image_data) VALUES (NULL), (NULL), (NULL), (NULL), (NULL);

-- Insert Users (all passwords hashed as '123456789')
INSERT INTO User (username, user_type, email, hashed_password, first_name, last_name, date_of_birth, image_id, bio, profile_type, nickname)
VALUES
('john_doe', 'admin', 'john.doe@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'John', 'Doe', '1990-01-01', 1, 'Hello, I am John! I love tech and management.', 'Public', 'Johnny'),
('jane_smith', 'member', 'jane.smith@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Jane', 'Smith', '1992-02-02', 2, 'Software developer and tech enthusiast.', 'Private', 'Janey'),
('alice_brown', 'member', 'alice.brown@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Alice', 'Brown', '1995-03-03', 3, 'Music is life! Passionate about coding too.', 'Public', 'Ali'),
('bob_white', 'admin', 'bob.white@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Bob', 'White', '1993-04-04', 4, 'Just here for fun, exploring new things.', 'Private', 'Bobby'),
('charlie_black', 'member', 'charlie.black@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Charlie', 'Black', '1988-05-05', NULL, 'Tech geek and gamer.', 'Public', 'Chuck'),
('david_green', 'member', 'david.green@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'David', 'Green', '1991-06-06', NULL, 'Freelancer and creative designer.', 'Public', 'Dave'),
('emily_young', 'admin', 'emily.young@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Emily', 'Young', '1994-07-07', NULL, 'Digital artist and content creator.', 'Public', 'Em'),
('frank_hall', 'member', 'frank.hall@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Frank', 'Hall', '1985-08-08', NULL, 'Writer and part-time traveler.', 'Private', 'Frankie'),
('grace_lee', 'member', 'grace.lee@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Grace', 'Lee', '1990-09-09', NULL, 'Marketing specialist with a love for art.', 'Public', 'Gracie'),
('henry_moore', 'admin', 'henry.moore@example.com', '$2b$12$KIX5dF25W5XhG.KYxG5p.e39wCn5D/NH9tEj8uaLE.kDHo6L8ENX2', 'Henry', 'Moore', '1987-10-10', NULL, 'Business consultant and entrepreneur.', 'Private', 'Hank');

-- Insert Follower Relationships
INSERT INTO Follower (following_id, follower_id, Follower_status)
VALUES
(1, 2, 'Accepted'), (2, 1, 'Accepted'), (3, 4, 'Pending'), (5, 6, 'Accepted'),
(6, 5, 'Accepted'), (4, 2, 'Accepted'), (7, 8, 'Accepted'), (9, 10, 'Accepted'), (10, 9, 'Accepted');

-- Insert Groups
INSERT INTO GroupTable (creator_id, title, group_description, image_id)
VALUES
(1, 'Tech Enthusiasts', 'A group for tech lovers and developers.', 1),
(2, 'Music Lovers', 'All about music and instruments.', 2),
(3, 'Digital Art', 'A group for sharing digital artworks and techniques.', 3);

-- Insert Group Members
INSERT INTO GroupMember (group_id, user_id)
VALUES
(1, 1), (1, 2), (1, 5), (2, 3), (2, 4), (2, 7), (3, 6), (3, 9);

-- Insert Group Requests (Invite and Request)
INSERT INTO GroupRequest (group_id, user_id, request_status, request_type)
VALUES
(1, 3, 'Pending', 'Request'), (2, 5, 'Accepted', 'Invite'), (3, 4, 'Rejected', 'Request'), (2, 8, 'Pending', 'Request');

-- Insert Posts (User and Group posts)
INSERT INTO Post (user_id, group_id, parent_id, content, privacy, image_id)
VALUES
(1, 1, NULL, 'Excited about the upcoming tech conference!', 'Public', 1),
(2, NULL, NULL, 'Check out my new blog post on coding techniques.', 'Private', NULL),
(3, 2, NULL, 'Here is my new guitar cover of a classic song.', 'Public', NULL),
(4, 2, NULL, 'Anyone want to jam this weekend?', 'Public', NULL),
(5, 1, NULL, 'Just built my first website!', 'Almost', NULL);

-- Insert Reactions to Posts
INSERT INTO Reaction (user_id, post_id, reaction_type)
VALUES
(2, 1, 'Like'), (3, 1, 'Like'), (1, 2, 'Like'), (4, 3, 'Like'), (5, 4, 'Dislike');

-- Insert Events
INSERT INTO EventTable (group_id, creator_id, title, event_description, event_time)
VALUES
(1, 1, 'Tech Conference 2024', 'Annual conference for tech enthusiasts.', '2024-12-10 10:00:00'),
(2, 2, 'Live Music Jam', 'An online jam session for musicians.', '2024-11-15 18:00:00'),
(3, 6, 'Art Workshop', 'Workshop on creating digital illustrations.', '2024-10-20 15:00:00');

-- Insert Event Options
INSERT INTO EventOptions (event_id, option_name)
VALUES
(1, 'Attend in Person'), (1, 'Attend Virtually'),
(2, 'Join Live Stream'), (3, 'Join Workshop in Zoom');

-- Insert Event Responses
INSERT INTO EventResponse (event_id, user_id, response_id)
VALUES
(1, 1, 1), (1, 2, 2), (2, 3, 3), (3, 6, 4), (2, 7, 3);

-- Insert Notifications
INSERT INTO UserNotification (user_id, sender_id, notification_type, group_id, event_id, is_read)
VALUES
(2, 1, 'Invite', 1, NULL, FALSE),
(3, 2, 'Event', NULL, 2, TRUE),
(5, 3, 'Event', NULL, 3, FALSE),
(6, 4, 'Message', NULL, NULL, TRUE),
(7, 1, 'Event', NULL, 1, FALSE);

-- Insert Additional Posts with "Almost" Privacy
INSERT INTO Post (user_id, group_id, parent_id, content, privacy, image_id)
VALUES
(1, NULL, NULL, 'Just finished reading a great book on AI!', 'Almost', NULL),
(2, NULL, NULL, 'Can anyone recommend some good coding resources?', 'Almost', NULL),
(3, NULL, NULL, 'Loved the new album by my favorite artist!', 'Almost', NULL),
(4, NULL, NULL, 'Can we organize a game night this weekend?', 'Almost', NULL),
(5, NULL, NULL, 'Just launched my new portfolio website!', 'Almost', NULL),
(6, NULL, NULL, 'Excited to attend the upcoming design workshop!', 'Almost', NULL),
(7, NULL, NULL, 'I just got back from an amazing trip to Japan!', 'Almost', NULL),
(8, NULL, NULL, 'Trying out a new recipe tonight, wish me luck!', 'Almost', NULL),
(9, NULL, NULL, 'Just finished my first marathon, feeling accomplished!', 'Almost', NULL),
(10, NULL, NULL, 'Who wants to join me for a movie night?', 'Almost', NULL);

-- Insert Recipients for the New Posts
INSERT INTO Recipient (post_id, recipient_id)
VALUES
(1, 2), (1, 3), (1, 4), (1, 5), -- Recipients for Post 1
(2, 1), (2, 3), (2, 5), (2, 6), -- Recipients for Post 2
(3, 1), (3, 2), (3, 4), (3, 5), -- Recipients for Post 3
(4, 2), (4, 3), (4, 5), (4, 6), -- Recipients for Post 4
(5, 1), (5, 2), (5, 3), (5, 4), -- Recipients for Post 5
(6, 3), (6, 4), (6, 5), (6, 7), -- Recipients for Post 6
(7, 1), (7, 2), (7, 8), (7, 9), -- Recipients for Post 7
(8, 3), (8, 4), (8, 5), (8, 6), -- Recipients for Post 8
(9, 1), (9, 2), (9, 6), (9, 10), -- Recipients for Post 9
(10, 1), (10, 2), (10, 3), (10, 4); -- Recipients for Post 10

-- Insert Group Chats
INSERT INTO GroupChat (group_id, sender_id, message, image_id)
VALUES
(1, 1, 'Hey everyone, are we still on for the meeting tomorrow?', NULL), -- Group 1
(1, 2, 'Yes, I’ll be there! What time are we meeting?', NULL),
(1, 3, 'I can’t wait! Let’s finalize the agenda.', NULL),
(2, 4, 'Who’s bringing snacks for the game night?', NULL), -- Group 2
(2, 5, 'I’ll bring some chips and dip!', NULL),
(2, 6, 'Count me in for pizza!', NULL),
(3, 7, 'What time does the workshop start?', NULL), -- Group 3
(3, 8, 'It starts at 10 AM. Looking forward to it!', NULL),
(3, 9, 'I’ll be there a bit early to grab a good seat!', NULL),
(1, 10, 'Let’s not forget to bring our laptops for the coding session.', NULL); -- Group 1

-- Insert User Chats
INSERT INTO UserChat (sender_id, receiver_id, message, image_id)
VALUES
(1, 2, 'How was your weekend?', NULL), -- User 1 to User 2
(2, 1, 'It was great! Just relaxed and caught up on some shows.', NULL),
(3, 4, 'Are you free to chat later today?', NULL), -- User 3 to User 4
(4, 3, 'Absolutely! Just let me know when.', NULL),
(5, 6, 'Let’s discuss the project details over coffee.', NULL), -- User 5 to User 6
(6, 5, 'Sounds good! How about 3 PM?', NULL),
(7, 8, 'I enjoyed the concert last night!', NULL), -- User 7 to User 8
(8, 7, 'It was awesome! We should go to more together.', NULL),
(9, 10, 'Did you finish the assignment?', NULL), -- User 9 to User 10
(10, 9, 'Almost done! I’ll send it to you once I finish.', NULL);



-- Insert Events for Group 1
INSERT INTO EventTable (group_id, creator_id, title, event_description, event_time)
VALUES
(1, 1, 'Weekly Team Meeting', 'A weekly meeting to discuss project updates and next steps.', '2024-10-15 10:00:00'),
(1, 2, 'Coding Workshop', 'An interactive workshop focusing on the latest coding techniques and tools.', '2024-10-22 14:00:00'),
(1, 3, 'Team Building Activity', 'A fun outing to strengthen team bonds and improve collaboration.', '2024-11-05 12:00:00'),
(1, 4, 'Project Review Session', 'A session to review project progress and address any issues.', '2024-11-10 09:00:00'),
(1, 5, 'End-of-Year Party', 'Celebration of our achievements over the year with food, drinks, and fun!', '2024-12-20 18:00:00'),
(1, 6, 'Feedback Gathering Session', 'A meeting to gather feedback on team processes and suggestions for improvement.', '2024-12-01 11:00:00'),
(1, 7, 'Holiday Planning Meeting', 'Discussion on plans for the upcoming holidays and team activities.', '2024-11-25 15:00:00'),
(1, 8, 'Brainstorming Session', 'A creative session to generate ideas for the next project.', '2024-10-30 16:00:00');


-- Insert Event Options for each event in Group 1
INSERT INTO EventOptions (event_id, option_name)
VALUES
-- Options for Weekly Team Meeting
(1, 'Attending'),
(1, 'Not Attending'),
(1, 'Maybe'),

-- Options for Coding Workshop
(2, 'Attending'),
(2, 'Not Attending'),
(2, 'Maybe'),

-- Options for Team Building Activity
(3, 'Attending'),
(3, 'Not Attending'),
(3, 'Maybe'),

-- Options for Project Review Session
(4, 'Attending'),
(4, 'Not Attending'),
(4, 'Maybe'),

-- Options for End-of-Year Party
(5, 'Attending'),
(5, 'Not Attending'),
(5, 'Maybe'),

-- Options for Feedback Gathering Session
(6, 'Attending'),
(6, 'Not Attending'),
(6, 'Maybe'),

-- Options for Holiday Planning Meeting
(7, 'Attending'),
(7, 'Not Attending'),
(7, 'Maybe'),

-- Options for Brainstorming Session
(8, 'Attending'),
(8, 'Not Attending'),
(8, 'Maybe');



