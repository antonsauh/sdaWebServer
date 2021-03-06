const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 5000;

const allowCrossDomain = function(req, response, next) {

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, key");

    // intercept OPTIONS method
    // if ('OPTIONS' == req.method) {
    //     response.send(200);
    // }
    // else {
    // }
    next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // parse form data client

app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port: ${port}`);
});
const apiKey = "1996";
let new_id = 3;
const users = [{
    id: 1,
    name: "Tony Montana",
    email: "tony@gmail.com",
    password: "123456789",
},
    {
        id: 2,
        name: "Al Capone",
        email: "alcapone@gmail.com",
        password: "987654321"
    }];

app.get("/users", (req, res, next) => {
    res.status(200);
    res.json(users);
});

app.post("/login", (req, res, next) => {
    console.log(req.body.toString());
if(req.header("key") === apiKey){
    if((req.body.email !== null && req.body.email !== "")
        && (req.body.password !== null && req.body.password)) {
        if(tryToLoginUser(req.body.email, req.body.password)) {
            res.status(200);
            res.header.sessionCookie = "12345";
            res.end("Login confirmed");
        }else {
            res.status(400);
            res.end("Bad credentials");
        }
    }else {
        res.status(400);
        res.end("Bad request");
    }
} else {
    res.status(401);
    res.end("Unauthorized request");
}
});

app.post("/users", (req, res, next) => {
    console.log(req.body.toString());
if (req.header("key") === apiKey) {
    if(!usersExists(req.body.email) && userDataPresent(req.body)) {
        users.push({
            id: new_id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        new_id++;
        res.status(200);
        res.end("good");
    }else {
        res.status(400);
        res.end("User with this email already exists");
    }
}else {
    res.status(401);
    res.end("Unauthorized request");
}

});

function usersExists(email) {
    let exists = false;
    users.forEach(function(user){
        if (user.email === email) {
            exists = true;
        }
    });
    return exists;
}

function userDataPresent(data) {
    let dataIsPresent = false;
    if((data.name !== "" && data.name !== null)
        && (data.email !== "" && data.email !== null)
        && (data.password !== "" && data.password !== null)) {
        dataIsPresent = true;
    }
    return dataIsPresent;
}

function tryToLoginUser(email, password) {
    let loginDecision = false;
    users.forEach(function(user){
        if(user.email === email && user.password === password) {
            loginDecision = true;
        }
    });
    return loginDecision;
}