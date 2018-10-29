const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 5000;

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // parse form data client

app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port: ${port}`);
});
const apiKey = "key";
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
res.json(users)
});

app.post("/login", (req, res, next) => {
    console.log(req.body + "-------" + req.header);
if(req.header("key") === apiKey){
    if((req.header.email !== null && req.header.email !== "")
        && (req.header.password !== null && req.header.password)) {
        if(tryToLoginUser(req.body.email, req.body.password)) {
            res.status(200);
            res.end("Login confirmed");
        }
    }
} else {
    res.status(401);
    res.end("Unauthorized request");
}
});

app.post("/users", (req, res, next) => {
    console.log(req.body + "-------" + req.header());
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