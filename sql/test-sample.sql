--? is the userinput

--login
SELECT *
FROM User
WHERE username = '42jliu'
    AND password = '74564jliu';

--register
INSERT INTO User
VALUES ('ababa', 'ALIBABA','abccba',7767787790);

--search by departure_city
SELECT *
FROM Carpool
WHERE departure_city = 'Toronto';

--search by destination_city
SELECT *
FROM Carpool
WHERE destination_city = 'Waterloo';

--search by time
SELECT *
FROM Carpool
WHERE time < '2022-10-23 11:30:00'
    AND time > '2022-10-20 09:00:00';

--search by departure_city, destination_city and time
SELECT *
FROM Carpool
WHERE departure_city = 'Toronto' 
    AND destination_city = 'Mississauga' 
    AND time < '2022-10-23 11:30:00'
    AND time > '2022-10-20 09:00:00';

--update profile
UPDATE User
SET password = '123321'
WHERE username = 'faye';

UPDATE User
SET phone_num = '123-456-7890'
WHERE username = 'faye';

--insert a driver
INSERT INTO Driver
VALUES ('Echo_K', 'K8578-02354-87566');

--calculate average price given departure_city and destination_city
SELECT AVG(price)
FROM carpool
WHERE departure_city = 'Toronto'
    AND destination_city = 'Waterloo';

--insert a car
INSERT INTO Car
VALUES ('NIME764', 'Lexus RX350 white', 3);

