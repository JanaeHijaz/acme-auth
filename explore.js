
/*
const jwt = require('jsonwebtoken');

Issues with current set up (using user.id as token):

-Simple token (user.id) is easy to guess and hack
-Developer is able to see the actual password in the database, i.e. not secure
-Password is accessible in the code itself, and being shared in the front end (browser)
-Password is in plain text!

These issues can be solved by using Json Web Tokens aka JWT (instead of the user.id as the token!), and bcrypt (hashing passwords).

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
*/


