const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejsMate = require('ejs-mate');
const { carpoolSchema, driverSchema, carSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

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
    res.render('home')
});

////////////////////////////user////////////////////////////////

////////////////////////////allcarpools////////////////////////////////
app.get('/allcarpools', catchAsync(async (req, res) => {
    // const carpools = await Carpool.find({}); // need replacing to MySQL
    db.query(
        'SELECT * FROM Carpool',
        function(err, carpools, fields) {
          console.log(carpools); // results contains rows returned by server
        //   console.log(typeof carpools);
          res.render('allcarpools/index', { carpools })
        //   console.log(fields); // fields contains extra meta data about results, if available
        }
      );
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

// tested not working
app.post('/driver/new', validateDriver, catchAsync(async (req, res) => {
    if (!req.body.driver) throw new ExpressError('Invalid Driver Data', 400);
    const result = await db.query(
        'INSERT INTO Driver VALUES(${req.body.driver.username}, ${req.body.driver.license_num})'
    );
    if (result.affectedRows) {
        console.log('Successfully inserted into Driver')
    } else {
        console.log('Error in inserting into Driver');
    }
    res.redirect(`/driver/car/new`);
}));

////////////////////driver/:driverusername/carpools////////////////////////////////
// tested not working
app.get('/driver/:driverusername/carpools', catchAsync(async (req, res) => {
    const { driverusername } = req.params;
    q = 'SELECT * FROM Carpool WHERE driver_username = ?';
    db.query(q, [driverusername], (err, carpools) => {
        if (err) return res.send(err);
        console.log(carpools);
        res.render('driver/carpools/index', { carpools });
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
//           res.render('driver/carpools/index', { carpools })
//         //   console.log(fields); // fields contains extra meta data about results, if available
//         }
//       );
// }));

// Tested not working
app.get('/driver/:driver-username/carpools/new', (req, res) => {
    res.render('driver/carpools/new');
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
    res.render('driver/carpools/show', { carpool });
}));

app.get('/driver/:driver-username/carpools/:carpool_id/edit', catchAsync(async (req, res) => {
    // TODO: need replacing to MySQL
    const carpool = await Carpool.findById(req.params.carpool_id)
    res.render('driver/carpools/edit', { carpool });
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

////////////////////////////driver/car////////////////////////////////
// Tested not working
app.get('/driver/car/new', (req, res) => {
    res.render('driver/car/new');
})
// TODO: more routes for /driver/car needed

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