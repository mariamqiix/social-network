-- User Table
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) UNIQUE,
    user_type VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    image_id INTEGER REFERENCES Image(id),
    bio TEXT,
    profile_type VARCHAR(50),
    nickname VARCHAR(255)
);

-- Follower Table
CREATE TABLE Follower (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    following_id INTEGER REFERENCES User(id),
    follower_id INTEGER REFERENCES User(id),
    status VARCHAR(50),
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES User(id),
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
