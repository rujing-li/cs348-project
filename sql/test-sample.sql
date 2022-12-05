
SELECT *
FROM User
WHERE username = '42jliu'
    AND password = '74564jliu';


INSERT INTO User
VALUES ('ababa', 'ALIBABA','abccba',7767787790);


SELECT *
FROM Carpool
WHERE departure_city = 'Toronto';


SELECT *
FROM Carpool
WHERE destination_city = 'Waterloo';


SELECT *
FROM Carpool
WHERE time < '2022-10-23 11:30:00'
    AND time > '2022-10-20 09:00:00';


SELECT *
FROM Carpool
WHERE departure_city = 'Toronto' 
    AND destination_city = 'Mississauga' 
    AND time < '2022-10-23 11:30:00'
    AND time > '2022-10-20 09:00:00';


UPDATE User
SET password = '123321'
WHERE username = 'faye';

UPDATE User
SET phone_num = '123-456-7890'
WHERE username = 'faye';


INSERT INTO Driver
VALUES ('Echo_K', 'K8578-02354-87566');


SELECT AVG(price)
FROM carpool
WHERE departure_city = 'Toronto'
    AND destination_city = 'Waterloo';


INSERT INTO Car
VALUES ('NIME764', 'Lexus RX350 white', 3);

SELECT * FROM Car, Drive WHERE Drive.driver_username = '4uE3IE' And Drive.plate_num = Car.plate_num