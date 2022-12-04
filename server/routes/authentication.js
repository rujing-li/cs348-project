import express from "express";

const router = express.Router();

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
router.post("/register", register);

/** login a user, select from user table */
const login = (req, res) => {

}


router.post("/login", login);

router.get("/", (req, res) => {
    res.json("this is auth");
})

router.get("/register", (req, res) => {
    res.json("this is register");
})

export default router;