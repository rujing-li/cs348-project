const http = require("http");
const querystring = require("querystring");
const mysql = require("mysql2");

const server = http.createServer((req,res)=>{
    let postVal = "";
    req.on("data",(chunk)=>{
        postVal += chunk;
    })
    req.on("end",()=>{
        let formVal = querystring.parse(postVal);
        let userName = formVal.userName;
        let userPwd = formVal.userPwd;

        let connection = mysql.createConnection({
            host: "localhost",
            user:"root",
            password:"St20010$0$",
            database:"demo1",
            port:3306
        })

        connection.connect();
        connection.query("select * from user where userName=? and userPwd=?",[userName,userPwd],(err,result,field)=>{
            if (err) throw err;
            if (result.length > 0) {
                res.write('login successfully!');
                res.end();
            } else {
                res.write('Please register')
                res.end();
            }
        })
    })
})

server.listen(8080);