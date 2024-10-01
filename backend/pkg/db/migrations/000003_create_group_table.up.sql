
-- Group Table
CREATE TABLE GroupTable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE,
    title VARCHAR(20),
    group_description TEXT,
    image_id INTEGER REFERENCES ImageTable(id) ON UPDATE CASCADE ON DELETE CASCADE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GroupMember Table
CREATE TABLE GroupMember (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER REFERENCES GroupTable(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- GroupRequest Table
CREATE TABLE GroupRequest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER REFERENCES GroupTable(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER REFERENCES User(id) ON UPDATE CASCADE ON DELETE CASCADE,
    request_status VARCHAR(50) DEFAULT 'Pending' CHECK (request_status IN ('Pending', 'Accepted', 'Rejected')),
    request_type VARCHAR(50) CHECK (request_type IN ('Invite', 'Request')),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
