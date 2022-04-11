const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const config = {
  logging: false
};

if(process.env.LOGGING){
  delete config.logging;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db', config);

const User = conn.define('user', {
  username: STRING,
  password: STRING
});

/*
7. 
this byToken class method (function) is called by the api GET request. 
this function takes in the token as its argument, and its purpose is the try to find the user via this token.
we use User.findByPk(token) to locate this user.
if there is a user, we return this user.
if not, we throw the 401 error. 
the user data that is returned is then sent back to attempttokenLogin (which made the initial GET request in the first place),
and calls setState with this response (user) data. in the "auth" object.
this.state = {
  auth: {
    username: username, 
    password: password
  }
}
*/
User.byToken = async(token)=> {
  try {
    const user = await User.findByPk(token); // since the token is currently the user.id, we can use findByPk. 
    if(user){
      return user;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  catch(ex){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};

/*
3.
the POST request calls this function with the user's credentials that it receives during the signIn step.
This authenticate function takes in the username and password as arguments. we need both bc we need to authenticate BOTH the username AND the password.
We use this data to findOne in the User model (below). 
IF there user exists already, i.e. if User.findOne({}) returns a user from our database, we return the user.id (for now, but this will change later w/ JWT)
If the log in credentials are inaccurate, OR the user cannot be found, this function will throw a 401 error.
The user.id that is returned (if successful), will then be sent BACK from the server (back in the POST request) as the token (for now).
*/
User.authenticate = async({ username, password })=> {
  const user = await User.findOne({
    where: {
      username,
      password
    }
  });
  if(user){
    return user.id; 
  }
  const error = Error('bad credentials');
  error.status = 401;
  throw error;
};

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { username: 'lucy', password: 'lucy_pw'},
    { username: 'moe', password: 'moe_pw'},
    { username: 'larry', password: 'larry_pw'}
  ];
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  );
  return {
    users: {
      lucy,
      moe,
      larry
    }
  };
};

module.exports = {
  syncAndSeed,
  models: {
    User
  }
};
