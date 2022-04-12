const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

const Note = conn.define('note', {
  text: STRING
});

Note.belongsTo(User);
User.hasMany(Note);

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
  // before, we were finding the user by the id (Pk), now we will find by the token.
  // however, in order to use this token, we need to unscramble it using jwt.verify.
  try {
    console.log(process.env.JWT)
    const unscrambledToken = jwt.verify(token, process.env.JWT)
    console.log(unscrambledToken) // prints: { userId: 2, iat: 1649701785 }
    const user = await User.findByPk(unscrambledToken.userId); 
    // before, the token was the user.id, so we could use findByPk. 
    // now, we are using JWT so we take the user.id value of unscrambledToken. 
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
  /* 
  previously, we were comparing username and password to username and password.
  now that we are using bcrypt to hash the password, it does not appear as "lucy_pw" in the datatebase.
  so how to we authenticate the user if the password is hashed?
  we use bcrypt.compareSync()
  */
  const user = await User.findOne({
    where: {
      username,
      // password // remove this, and just search for user based on the username
    }
  });
  
  // add new instructions for is there isn't a user found from the log in input.

  if (!user){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }

 // now create a variable for the comparison of the input password and hashed pw in the db.
  const passwordsMatch = bcrypt.compareSync(password, user.password); // returns a boolean

  if(passwordsMatch){ // change this from (user) since we want the boolean of the compareSync above.
    const newToken = jwt.sign({ userId: user.id }, process.env.JWT) // brogle is the secretKey
    return newToken;
    // return user.id; // now want to replace this with JWT. 
  }
  const error = Error('bad credentials');
  error.status = 401;
  throw error;
};

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { username: 'lucy', password: bcrypt.hashSync('lucy_pw', 10)}, // added bcrpyt to user model data
    { username: 'moe', password: bcrypt.hashSync('moe_pw', 10)},
    { username: 'larry', password: bcrypt.hashSync('larry_pw', 10)}
  ];
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  );
  const notes = [ { text: 'hello world' }, { text: 'reminder to buy groceries' }, { text: 'reminder to do laundry' } ];
  const [note1, note2, note3] = await Promise.all(
    notes.map( note => Note.create(note) )
  );
  await lucy.setNotes(note1);
  await moe.setNotes([note2, note3]);
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
    User,
    Note
  }
};
