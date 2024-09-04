-- UserChat Table
CREATE TABLE UserChat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER REFERENCES User(id),
    receiver_id INTEGER REFERENCES User(id),
    message TEXT,
    image_id INTEGER REFERENCES Image(id),
    is_read BOOLEAN DEFAULT FALSE
);


-- GroupChat Table
CREATE TABLE GroupChat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER REFERENCES GroupTable(id),
    sender_id INTEGER REFERENCES User(id),
    message TEXT,
    image_id INTEGER REFERENCES Image(id),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);