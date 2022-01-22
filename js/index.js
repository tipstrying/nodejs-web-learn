var express = require('express')
var app = express()
var config = require('./config')

var session = require('express-session')
var bodyParser = require('body-parser')

if (config.logintype == "urlencoded") {
    app.use(bodyParser.urlencoded({ extended: true }))
} else {
    app.use(bodyParser.json());       // to support JSON-encoded bodies
}

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

var cookieParser = require("cookie-parser");
app.use(cookieParser())

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    createParentPath: true
}));

const cors = require('cors');
app.use(cors());



var r = require("./drive-route")

app.use('/', express.static('../html'))

app.post('/login', (req, res) => {
    if (config.user[req.body.username]) {
        if (config.user[req.body.username].password == req.body.password) {
            req.session.username = req.body.username
        } else {
            res.json(404, { message: "password error" })
        }
    } else {
        res.json(404, { message: "username not exists" })
    }
})

app.use(r);

app.listen(80, () => {
    console.log("start on 80")
})