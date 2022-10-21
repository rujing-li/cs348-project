CREATE TRIGGER AvailabilityChecck
BEFORE INSERT OF availability ON Carpool 
REFERENCING NEW ROW AS newCarpool 
FOR EACH ROW
    
