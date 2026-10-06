CREATE TABLE User(
    id BIGSERIAL PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE LOWERCASE,
    profilePhoto VARCHAR(255) DEFAULT 'defaultimageurl',
    phone VARCHAR(12),
    gender VARCHAR(10) CHECK gender IN ('male', 'female'),
    subscription BIGINT REFERENCES 'Subscription'(id),
    posts BIGINT REFERENCES "Post"(id)[],
    governmentIdType VARCHAR(200) CHECK governmentIdType IN ('passport', 'DL', 'aadhar'),
    governmentIdNumber VARCHAR(255),
    governmentIdImage VARCHAR(255),
    status VARCHAR(20) CHECK(status IN ('verified', 'unverified')) DEFAULT 'unverified',
    refreshToken VARCHAR(255),
    location JSONB,
    region varchar(255),
    locationPermission BOOLEAN DEFAULT false,
    district varchar(255),
    state varchar(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE INDEX region ON User(region);