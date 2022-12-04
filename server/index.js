import express from "express";
import mysql from "mysql";
import jwt from "jsonwebtoken";

// import authRoutes from "./routes/authentication.js";
// import postRoutes from "./routes/posts.js";
import cors from "cors";
import cookieParser from "cookie-parser";

let currentUser = "";

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Yyf020603!', // <your-password>
    database: 'RideShare',
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.use(cors());
app.use(express.json());
app.use(cookieParser());


/** register a user, insert into user table */
const register = (req, res) => {
    // check if user already exists
    const q = "SELECT * FROM user WHERE username = ?";
    const userName = req.body.username;
    const userPwd = req.body.password;
    const userLN = req.body.legal_name;
    const userPN = req.body.phone_num;

    db.query(q, [userName], (err, data) => {
        if (err) return res.json(err);
        if (data.length) {  // if there is a data
            return res.status(409).json("User already exists!")
        }

        // create a user, insert user into users table
        const insertSQL = "INSERT INTO User VALUES (?)";
        const values = [
            userName, 
            userLN, 
            userPwd,
            userPN
        ];

        db.query(insertSQL, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        })

        
    })
};
app.post("/api/auth/register", register);


/** login a user */
const login = (req, res) => {
    // Check if user exists
    const q = "SELECT * FROM User WHERE username = ? AND password = ?";
    const userName = req.body.username;
    const password = req.body.password;
    db.query(q, [userName, password], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) {
            // we don't have any user in this db
            return res.status(404).json("Wrong username or password.");
        } else {    // use found
            // login
            currentUser = data[0].username;
            console.log(currentUser);
            const token = jwt.sign({id:data[0].username}, "jwtkey");

            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json(data[0]);

        }
       
    });

};
app.post("/api/auth/login", login);



app.get("/", (req, res) => {
    res.json("it works?")
});

app.listen(3001, () => {
    console.log("Connected on port 3001")
})