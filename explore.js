
/*
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

Issues with current set up (using user.id as token):

-Simple token (user.id) is easy to guess and hack
-Developer is able to see the actual password in the database, i.e. not secure
-Password is accessible in the code itself, and being shared in the front end (browser)
-Password is in plain text!

These issues can be solved by using Json Web Tokens aka JWT (instead of the user.id as the token!), and bcrypt (hashing passwords).
*/

/*
JSON Web Tokens (JWT): they give us a way to represent information or sensitive data in an encrypted way.

Encryption is the idea that you take some data or value, and you use an algorithm/funciton to turn that value 
into something that appears scrambled. That is the encoded value. 
And anything that is encoded can, through the same process, be reversed to its original value/form.

This encryption process makes this data safe to be sent over the network, or even be viewed by others who may not have good intentions.

JWTs consist of 3 parts, each separated by a '.': 
- Header: identifies which algorithm is used the generate the signature
- Payload: holds the "claims" or key:value pairs of teh actual data that you want to encrypt.
- Signature: validates the token to make sure it hasnt been altered in any way. 
JWTs are serialized using base64. 

JWT Documentation: 
https://www.npmjs.com/package/jsonwebtoken
https://github.com/auth0/node-jsonwebtoken

Two main methods that we need to use with JWT:
1. jwt.sign(payload (object), secreyKey (string)) => to encrypt data
2. jwt.verify(token (encrypted or variable), secreyKey (string)) => to reverse the encryption back to original value

const token = jwt.sign({ name: "janae" }, "velblouds");
const transformedBack = jwt.verify(token, "velblouds");

confirm how to update your bashrc or zshrc instead of setting JWT secret key in package.json
*/

/* 
Hashing Passwords:

We encrypt passwords so that they do not appear as plain text in the database. Not even the developer herself 
who creates the database should EVER be able to see a user's actual password.  

We use bcrypt library in order to hash the password, and it has 2 main functions: 
 1. bcrypt.hashSync(password (string), saltRounds(num)) - creates a hashed value from a plain text password (that the user enters but we never see in database)
 2. bcrypt.compareSync(password (string), hashedPassword) - compares a plain password against a hashed password.

 const hashedPassword = bcrypt.hashSync('moe_pw', 10);
 const comparison = bcrypt.compareSync('mow_pw', hashedPassword);

This means that unlike jwt.sign/jwt.verify, there is not way to decode the password back to its original text.
We are only able to compare new plain text to a hashed password that was already used previously to know if it is the same or not.
This is called 1-way encryptions/hashing.

Salt:
process of hashing/encrypting a password or other value.
salt rounds refer to the number of times (or rounds) or hashing the data. 
so 10 salt rounds means you've hashed the password, then taken that result and hashed it again, and then again...up until 10 times.

We want to implement hashing as soon as passwords are entered into the site. 
Where does this happen? typically, during the Sign Up process. 
But in this codebase, we dont have a sign up, but we do have a database where that password data is created.





*/


