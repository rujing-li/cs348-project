CREATE TRIGGER AvailabilityChecck
BEFORE INSERT ON Carpool 
REFERENCING NEW ROW AS newCarpool 
FOR EACH ROW 
    WHEN (newCarpool.availablity > ANY(SELECT max_seats 
                                        FROM car
                                        WHERE newCarpool.car_plate = car.plate_num))
         SET newCarpool.availablity = (SELECT MIN(max_seats)
                                        FROM car
                                        WHERE new.Carpool.car_plate = car.plate_num) - 1;
    
