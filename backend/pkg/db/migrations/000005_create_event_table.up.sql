-- Event Table
CREATE TABLE Event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER REFERENCES GroupTable(id),
    creator_id INTEGER REFERENCES User(id),
    title VARCHAR(20),
    description TEXT,
    event_time TIMESTAMP,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EventResponse Table
CREATE TABLE EventResponse (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER REFERENCES Event(id),
    user_id INTEGER REFERENCES User(id),
    response VARCHAR(100),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
