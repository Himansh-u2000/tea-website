CREATE TABLE Post(
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    thumbnail VARCHAR(255),
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createBy BIGINT REFERENCES "User"(id) NOT NULL,
    images VARCHAR(255)[],
    postUrl VARCHAR(255) NOT NULL,
    location JSONB,
    comment BIGINT REFERENCES "Comment"(id),
    region VARCHAR(255)
    locationPermission BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE INDEX region
ON Post(region);