-- Post Table
CREATE TABLE Post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES User(id),
    group_id INTEGER REFERENCES GroupTable(id),
    parent_id INTEGER REFERENCES Post(id),
    content TEXT,
    image_id INTEGER REFERENCES Image(id),
    privacy VARCHAR(10) CHECK (privacy IN ('public', 'private', 'almost')),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipient Table
CREATE TABLE Recipient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER REFERENCES Post(id),
    recipient_id INTEGER REFERENCES User(id)
);

-- Reaction Table
CREATE TABLE Reaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES User(id),
    post_id INTEGER REFERENCES Post(id),
    reaction_type VARCHAR(10) CHECK (reaction_type IN ('like', 'dislike')),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
