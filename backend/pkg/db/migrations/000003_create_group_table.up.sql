
-- Group Table
CREATE TABLE GroupTable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id INTEGER REFERENCES User(id),
    title VARCHAR(20),
    description TEXT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GroupMember Table
CREATE TABLE GroupMember (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER REFERENCES GroupTable(id),
    user_id INTEGER REFERENCES User(id)
);

-- GroupRequest Table
CREATE TABLE GroupRequest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER REFERENCES GroupTable(id),
    user_id INTEGER REFERENCES User(id),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
    type VARCHAR(50) CHECK (type IN ('Invite', 'Request')),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
