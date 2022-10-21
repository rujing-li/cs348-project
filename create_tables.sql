CREATE TABLE User 
( 
  username VARCHAR NOT NULL PRIMARY KEY,
  legal_name VARCHAR NOT NULL,
  password VARCHAR NOT NULL, 
  phone_num VARCHAR NOT NULL
);

CREATE TABLE Driver 
(
  username INTEGER NOT NULL PRIMARY KEY REFERENCES User(username),
  license_num VARCHAR NOT NULL
);

CREATE TABLE Car
(
  plate_num VARCHAR NOT NULL PRIMARY KEY,
  description VARCHAR,
  max_seats INTEGER NOT NULL
);

CREATE TABLE Carpool
(
  driver_username VARCHAR NOT NULL REFERENCES User(username),
  time DATETIME NOT NULL,
  departure_city VARCHAR NOT NULL,
  destination_city VARCHAR NOT NULL,
  availability INTEGER NOT NULL,
  price DECIMAL,
  PRIMARY KEY(driver_username, time)
);

CREATE TABLE Drive
(
  FOREIGN KEY (driver_username) REFERENCES Driver(username),
  plate_num VARCHAR NOT NULL REFERENCES Car(plate_num),
  PRIMARY KEY (driver_username, plate_num)
);

CREATE TABLE Ride
(
  FOREIGN KEY (driver_username) REFERENCES Driver(username),
  time DATETIME NOT NULL,
  FOREIGN KEY (passenger_username) REFERENCES User(username),
  PRIMARY KEY (driver_username, time, passenger_username)
);





