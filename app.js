const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejsMate = require('ejs-mate');
const { carpoolSchema, driverSchema, carSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const { request } = require('http');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cs348cs348', // <your-password>
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
app.get('/', (req, res) => {
    res.redirect('/allcarpools')
});

app.post('/', (req, res) => {
    var action = req.body.action;
    if (action == "Login") {
        var userName = req.body.user.username;
        var userPwd = req.body.user.userpwd;
        db.query("SELECT * FROM user WHERE username=? and password=?",[userName,userPwd],function(err,data){
        if (err) {
            throw err;
        } else if (data.length > 0) {
            res.redirect('allcarpools');
        } else {
            res.end('wrong username or password');
        }
    })} else {
        res.redirect('register');
    }
  });

app.get('/register',(req,res) => {
    res.render('register')
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
            res.redirect('/');
        }
    })
});
////////////////////////////user////////////////////////////////

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

// tested insertion not working
app.post('/driver/new', validateDriver, catchAsync(async (req, res) => {
    if (!req.body.driver) throw new ExpressError('Invalid Driver Data', 400);
    const result = await db.query(
        'INSERT INTO Driver VALUES(${req.body.driver.username}, ${req.body.driver.license_num})'
    );
    if (result.affectedRows) {
        console.log('Successfully inserted into Driver');
    } else {
        console.log('Error in inserting into Driver');
    }
    res.redirect(`car/new`);
}));

////////////////////driver/:driverusername/carpools////////////////////////////////
// tested selection not working
app.get('/driver/:driverusername/carpools', catchAsync(async (req, res) => {
    const { driverusername } = req.params;
    q = 'SELECT * FROM Carpool WHERE driver_username = ?';
    db.query(q, [driverusername], (err, carpools) => {
        if (err) return res.send(err);
        console.log(carpools);
        res.render('driver-carpools/index', { carpools });
    });
}));
// alternative version
// app.get('/driver/:driverusername/carpools', catchAsync(async (req, res) => {
//     // const carpools = await Carpool.find({}); // need replacing to MySQL
//     const { driverusername } = req.params;
//     db.query(
//         'SELECT * FROM Carpool WHERE driver_username = ${driverusername}',
//         function(err, carpools, fields) {
//           console.log(carpools); // results contains rows returned by server
//         //   console.log(typeof carpools);
//           res.render('driver-carpools/index', { carpools })
//         //   console.log(fields); // fields contains extra meta data about results, if available
//         }
//       );
// }));

// tested frontend not working
app.get('/driver/:driver-username/carpools/new', (req, res) => {
    const { driverusername } = req.params;
    res.render('driver-carpools/new', { driverusername });
})

app.post('/driver/:driver-username/carpools', validateCarpool, catchAsync(async (req, res, next) => {
    if (!req.body.carpool) throw new ExpressError('Invalid Carpool Data', 400);
    // TODO: need replacing to MySQL
    const carpool = new Carpool(req.body.carpool); 
    await carpool.save();

    res.redirect(`/driver/:driver-username/carpools/${carpool.carpool_id}`)
}))

app.get('/driver/:driver-username/carpools/:carpool_id', catchAsync(async (req, res,) => {
    // TODO: need replacing to MySQL
    const carpool = await Carpool.findById(req.params.carpool_id)
    res.render('driver-carpools/show', { carpool });
}));

app.get('/driver/:driver-username/carpools/:carpool_id/edit', catchAsync(async (req, res) => {
    // TODO: need replacing to MySQL
    const carpool = await Carpool.findById(req.params.carpool_id)
    res.render('driver-carpools/edit', { carpool });
}))

app.put('/driver/:driver-username/carpools/:carpool_id', validateCarpool, catchAsync(async (req, res) => {
    const { carpool_id } = req.params;
    // TODO: need replacing to MySQL
    const carpool = await Carpool.findByIdAndUpdate(carpool_id, { ...req.body.carpool });
    res.redirect(`/driver/carpools/${carpool.carpool_id}`)
}));

app.delete('/driver/:driver-username/carpools/:carpool_id', catchAsync(async (req, res) => {
    const { carpool_id } = req.params;
    // TODO: need replacing to MySQL
    await Carpool.findByIdAndDelete(carpool_id);
    res.redirect('/driver/${driverusername}/carpools');
}));

////////////////////////////car////////////////////////////////
app.get('/car/new', (req, res) => {
    res.render('car/new');
})
// TODO: more routes for /car needed

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