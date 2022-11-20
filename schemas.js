const Joi = require('joi');

module.exports.carpoolSchema = Joi.object({
    carpool: Joi.object({
        driver_username: Joi.string().required(),
        time: Joi.string().required(),
        price: Joi.number().required().min(0),
        car_plate: Joi.string().required(),
        departure_city: Joi.string().required(),
        destination_city: Joi.string().required(),
        availability: Joi.string().required()        
    }).required()
});

module.exports.driverSchema = Joi.object({
    driver: Joi.object({
        username: Joi.string().required(),
        license_num: Joi.string().required()
    }).required()
});

module.exports.carSchema = Joi.object({
    car: Joi.object({
        plate_num: Joi.string().required(),
        description: Joi.string().required(),
        max_seats: Joi.number().required().min(1)
        // image: Joi.string().required()
    }).required()
});