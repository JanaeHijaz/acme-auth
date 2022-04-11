const express = require('express');
const app = express();
app.use(express.json());
const { models: { User }} = require('./db');
const path = require('path');

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

/*
2.
This POST request is sent after the initial sign in. the log in credentials that the user inputs are compiled as a req.body.
Once the server has this req.body, it then calls this "authenticate" function (in db.js), with that req.body/credentials as the input.
*/
app.post('/api/auth', async(req, res, next)=> {
  // req.body expected to be {username: "moe", password: "moe_pw"}
  try {
    res.send({ token: await User.authenticate(req.body)}); 
    /* 
    what is returned from the authenticate function in db.js, will look like "{token: 1}" for example. 
    in the network tab, you will find this in "Preview" tab. 
    */
  }
  catch(ex){
    next(ex);
  }
});
/*
6.  
the GET route to api/auth is often called the "ME" route, since it tells you who you are.
this GET request is initiated by the attemptTokenLogin function.
we send the GET request with the token in order to get additional information about the user.
this GET request takes in the req.headers.authorization, which in the network tab under Request Headers, is the user.id (will be a JWT token later).
this route calls ANOTHER class method, called byToken (in db.js), with this token (which is returned as headers.authorization).
*/
app.get('/api/auth', async(req, res, next)=> {
  try {
    res.send(await User.byToken(req.headers.authorization));
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
