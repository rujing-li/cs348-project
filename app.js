const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejsMate = require('ejs-mate');
const { carpoolSchema, driverSchema, carSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const { request } = require('http');
const { abort } = require('process');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // <your-password>
  database: 'RideShare',
  port: 3306
});
db.connect();

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCarpool = (req, res, next) => {
    const { error } = carpoolSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateDriver = (req, res, next) => {
    const { error } = driverSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateCar = (req, res, next) => {
    const { error } = carSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

////////////////////////////home////////////////////////////////

////////////////////////////user////////////////////////////////
app.get('/login', (req, res) => {
    res.render('user/login');
    //res.redirect('/allcarpools')
});

app.post('/login', (req, res) => {
    var action = req.body.action;
    if (action == "Login") {
        var userName = req.body.user.username;
        var userPwd = req.body.user.userpwd;
        db.query("SELECT * FROM user WHERE username=? and password=?",[userName,userPwd],function(err,data){
        if (err) {
            throw err;
        } else if (data.length > 0) {
            res.redirect(`/user/${userName}`);
        } else {
            res.end('wrong username or password');
        }
    })} else {
        res.redirect('register');
    }
  });

app.get('/register',(req,res) => {
    res.render('user/register');
});

app.post('/register', async (req,res) =>{
    var userName = req.body.user.username;
    var userPwd = req.body.user.userpwd;
    var userLN = req.body.user.legal_name;
    var userPN = req.body.user.phone_number;

    console.log (userName,userPwd,userLN,userPN);
    db.query("INSERT INTO user VALUES (?,?,?,?)",[userName,userLN,userPwd,userPN],function(err,data){
        if (err) {
            throw err;
        } else {
            res.redirect('/login');
        }
    })
});

app.get('/user/:username',(req,res) =>{
    const username = req.params.username;
    const q = "SELECT * FROM user WHERE username = ?";
    db.query("SELECT * FROM driver INNER JOIN user ON driver.username = user.username WHERE driver.username = ?", [username], (err, driver) => {
        console.log(username);
        if (err) return res.send(err);
        if (driver.length > 0){    
            console.log(driver);
            let dr = driver[0];
            console.log(dr);
            res.render('driver/profile',{dr});
        } else {
            db.query(q, [username], (err, users) => {
                if (err) return res.send(err);
                console.log(users);
                let user = users[0];
                res.render('user/profile', {user});
            });
        }
    })    
});

app.get('/user/:username/edit', (req,res)=>{
    const username = req.params.username;
    res.render('user/edit',{username});
})

app.put('/user/:username', async (req,res) =>{
    const userName = req.params.username;
    var userPwd = req.body.user.newpwd;
    var userLN = req.body.user.legal_name;
    var userPN = req.body.user.phone_number;

    console.log (userName,userPwd,userLN,userPN);
    db.query("UPDATE user Set password=?, legal_name=?, phone_num=? WHERE username = ?",[userPwd,userLN,userPN,userName],function(err,data){
        if (err) {
            throw err;
        } else {
            res.redirect(`/user/${userName}`);
        }
    });
});

app.get('/driver/:username/cars', (req,res)=>{
    var userName = req.params.username;
    console.log(userName);
        db.query(
            'SELECT * FROM Car, Drive WHERE Drive.driver_username = ? And Drive.plate_num = Car.plate_num',[userName],function(err,cars,fields) {
                console.log(cars);
                res.render('driver/cardisplay',{cars, userName})
            }
        )
});

////////////////////////////allcarpools////////////////////////////////
app.get('/allcarpools/search', catchAsync(async (req, res) => {
    res.render('allcarpools/search')
}));

app.post('/allcarpools/search', catchAsync(async (req, res) => {
    res.redirect(`/allcarpools/?departure=${req.body.carpool.departure}&destination=${req.body.carpool.destination}&time_start=${req.body.carpool.time_start}&time_end=${req.body.carpool.time_end}`);
}));

app.get('/allcarpools', catchAsync(async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        db.query(
            'SELECT * FROM Carpool',
            function(err, carpools, fields) {
              console.log(carpools); // results contains rows returned by server
            //   console.log(typeof carpools);
              res.render('allcarpools/index', { carpools })
            //   console.log(fields); // fields contains extra meta data about results, if available
            }
          );
    } else {
        const departure = req.query.departure;
        const destination = req.query.destination;
        const time_start = req.query.time_start;
        const time_end = req.query.time_end;
        // sample url: http://localhost:3000/allcarpools/?departure=Toronto&destination=Waterloo&time_start=2022-10-20%2009:00:00&time_end=2022-12-10%2011:30:00
        const q = 'SELECT * FROM Carpool WHERE departure_city = ? AND destination_city = ? AND time > ? AND time < ? order by time';
        db.query(q, [departure, destination, time_start, time_end], (err, carpools) => {
            if (err) return res.send(err);
            console.log(carpools); // results contains rows returned by server
            res.render('allcarpools/results', { carpools })
        }
        );
    }
    
}));

app.get('/allcarpools/:carpool_id', (req, res) => {
    const carpool_id = req.params.carpool_id;
    const q = "SELECT * FROM Carpool WHERE carpool_id = ?";

    db.query(q, [carpool_id], (err, carpools) => {
        if (err) return res.send(err);
        console.log(carpools);
        let carpool = carpools[0];
        res.render('allcarpools/show', { carpool });
    });
});

////////////////////////////driver////////////////////////////////
app.get('/driver/new', catchAsync(async (req, res) => {
    res.render('driver/new');
}));

app.post('/driver/new', validateDriver, catchAsync(async (req, res) => {
    var userName = req.body.driver.username;
    var licenseNum = req.body.driver.license_num;

    console.log (userName,licenseNum);

    db.query("SELECT * FROM user WHERE username=?",[userName],function(err,data){
        if (err) {
            throw err;
        } else if (data.length > 0) {
            db.query("INSERT INTO driver VALUES (?,?)",[userName,licenseNum],function(err,data){
                if (err) {
                    throw err;
                } else {
                    res.redirect(`/car/${userName}/new`);
                }
            })
        } else {
            res.end('please become a user to become a driver');
        } 
})}));

////////////////////driver/:driverusername/carpools////////////////////////////////
// shows all carpools posted by this driver
app.get('/driver/:dusername/carpools', catchAsync(async (req, res) => {
    const { dusername } = req.params;
    q = 'SELECT * FROM Carpool WHERE driver_username = ?';
    db.query(q, [dusername], (err, carpools) => {
        if (err) return res.send(err);
        console.log(carpools);
        res.render('driver-carpools/index', { carpools, dusername });
    });
}));

// allow this driver to add new carpool
app.get('/driver/:dusername/carpools/new', (req, res) => {
    const dusername = req.params.dusername;
    res.render('driver-carpools/new', { dusername });
})

app.post('/driver/:dusername/carpools', validateCarpool, catchAsync(async (req, res, next) => {
    const dusername = req.params.dusername;
    if (!req.body.carpool) throw new ExpressError('Invalid Carpool Data', 400);
    db.query("SELECT * FROM Driver WHERE username=?",[dusername],function(err,data){
        if (err) {
            throw err;
        } else if (data.length > 0) {
            let carpool = req.body.carpool;
            console.log("Driver requesting to add new carpool exists in the database.")
            let carpool_id = 0;
            db.query("SELECT COUNT(carpool_id) AS total FROM Carpool", function(err, data){
                carpool_id = Object.values(data)[0]['total'] + 1;
                console.log("New carpool ID: ", carpool_id);
                db.query("SELECT * FROM Drive, Car WHERE Drive.plate_num = Car.plate_num AND Drive.driver_username = ? AND Car.plate_num = ?",
                    [dusername, carpool.car_plate], function(err, results) {
                        console.log("results is: ", results);
                    if (!Object.values(results).length) {
                        res.end('Car with plate num does not exist yet.');
                        return;
                    }
                    else {
                        console.log("here", Object.values(results)[0]);
                        let max_seat = Object.values(results)[0]['max_seats'];
                        console.log("Max seat of this car is ", max_seat);
                        if (carpool.availability > max_seat) {
                            res.end('Availability of this carpool exceeds maximum seat of the car.');
                            return;
                        }
                    }
                    db.query("INSERT INTO Carpool VALUES (?,?,?,?,?,?,?,?)",[
                        carpool_id, dusername, carpool.time, carpool.departure_city, carpool.destination_city, 
                        carpool.car_plate, carpool.availability, carpool.price
                    ], function(err,data){
                    if (err) {
                        throw err;
                    } else {
                        res.redirect(`/driver/${dusername}/carpools/${carpool_id}`)
                    }
                    })
                })
            });
        } else {
            res.end('Driver username not found in Database');
        } 
    })
}))

// show a specific carpool of this driver
app.get('/driver/:dusername/carpools/:carpool_id', catchAsync(async (req, res,) => {
    const dusername = req.params.dusername;
    const carpool_id = req.params.carpool_id;
    q = 'SELECT * FROM Carpool WHERE driver_username = ? AND carpool_id = ?';
    db.query(q, [dusername, carpool_id], (err, carpools) => {
        console.log(carpools);
        if (err) return res.send(err);
        let carpool = carpools[0];
        console.log(carpool);
        res.render('driver-carpools/show', { carpool });
    });
}));

// allow this driver to edit a specific carpool
app.get('/driver/:dusername/carpools/:carpool_id/edit', catchAsync(async (req, res) => {
    const dusername = req.params.dusername;
    const carpool_id = req.params.carpool_id;
    q = 'SELECT * FROM Carpool WHERE driver_username = ? AND carpool_id = ?';
    db.query(q, [dusername, carpool_id], (err, carpools) => {
        console.log(carpools);
        if (err) return res.send(err);
        let carpool = carpools[0];
        console.log(carpool);
        res.render('driver-carpools/edit', { carpool });
    });
}))

app.put('/driver/:dusername/carpools/:carpool_id', validateCarpool, catchAsync(async (req, res) => {
    const dusername = req.params.dusername;
    const carpool_id = req.params.carpool_id;
    if (!req.body.carpool) throw new ExpressError('Invalid Carpool Data', 400);
    let carpool = req.body.carpool;
    q = 'UPDATE Carpool SET time = ?, departure_city = ?, destination_city = ?, car_plate = ?, availability = ?, price = ? WHERE driver_username = ? AND carpool_id = ?';
    db.query(q, [ carpool.time, carpool.departure_city, carpool.destination_city, carpool.car_plate, 
                carpool.availability, carpool.price, dusername, carpool_id ], (err, results) => {
            console.log(results);
            if (err) return res.send(err);
            res.redirect(`/driver/${dusername}/carpools/${carpool_id}`)
    });
}));

// allow this driver to delete a specific carpool
app.delete('/driver/:dusername/carpools/:carpool_id', catchAsync(async (req, res) => {
    const dusername = req.params.dusername;
    const carpool_id = req.params.carpool_id;
    q = 'DELETE FROM Carpool WHERE driver_username = ? AND carpool_id = ?';
    db.query(q, [dusername, carpool_id], (err, results) => {
        console.log(results);
        if (err) return res.send(err);
        res.redirect(`/driver/${dusername}/carpools`);
    });
}));

////////////////////////////car////////////////////////////////
app.get('/car/:username/new', (req, res) => {
    var username = req.params.username;
    res.render('car/new',{username});
})
// TODO: more routes for /car needed

app.post('/car/:username/new', catchAsync(async (req, res) => {
    var userName = req.params.username;
    var plateNum = req.body.car.plate_num;
    var description = req.body.car.description;
    var maxSeats = req.body.car.max_seats;

    console.log (plateNum,description,maxSeats);

    db.query("INSERT INTO drive VALUES (?,?)",[userName,plateNum],function(err,data){
        if (err) {
            throw err;
        }
    })
    db.query("INSERT INTO car VALUES (?,?,?)",[plateNum,description,maxSeats],function(err,data){
        if (err) {
            throw err;
        } else {
            res.redirect(`/driver/${userName}/carpools/new`);
        }
    })

}));

////////////////////////////miscellaneous////////////////////////////////
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})