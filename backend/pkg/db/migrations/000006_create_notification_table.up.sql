-- Notification Table
CREATE TABLE Notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES User(id),
    notification_type VARCHAR(50),
    group_id INTEGER REFERENCES GroupTable(id),
    event_id INTEGER REFERENCES Event(id),
    is_read BOOLEAN DEFAULT FALSE,
    sender_id INTEGER REFERENCES User(id)
);
