CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    password varchar(100) NOT NULL
);
CREATE TABLE refreshTokens (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tokenValue varchar(200) NOT NULL
);