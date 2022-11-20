CREATE TABLE User
(
  username VARCHAR(30) NOT NULL PRIMARY KEY,
  legal_name VARCHAR(30) NOT NULL,
  password VARCHAR(30) NOT NULL,
  phone_num VARCHAR(30) NOT NULL
);

CREATE TABLE Driver
(
  username VARCHAR(30) NOT NULL PRIMARY KEY REFERENCES User(username),
  license_num VARCHAR(30) NOT NULL
);

CREATE TABLE Car
(
  plate_num VARCHAR(30) NOT NULL PRIMARY KEY,
  description VARCHAR(30),
  max_seats CHAR(10) NOT NULL
);

CREATE TABLE Carpool
(
  carpool_id INT PRIMARY KEY,
  driver_username VARCHAR(30) NOT NULL REFERENCES User(username),
  time DATETIME NOT NULL,
  departure_city VARCHAR(30) NOT NULL,
  destination_city VARCHAR(30) NOT NULL,
  car_plate VARCHAR(30) NOT NULL,
  availability CHAR(10) NOT NULL,
  price DECIMAL
);

CREATE TABLE Drive
(
  driver_username VARCHAR(30) NOT NULL REFERENCES Driver(username),
  plate_num VARCHAR(30) NOT NULL REFERENCES Car(plate_num),
  PRIMARY KEY (driver_username, plate_num)
);

CREATE TABLE Ride
(
  driver_username VARCHAR(30) NOT NULL REFERENCES Driver(username),
  time DATETIME NOT NULL,
  passenger_username VARCHAR(30) NOT NULL REFERENCES User(username),
  PRIMARY KEY (driver_username, time, passenger_username)
);