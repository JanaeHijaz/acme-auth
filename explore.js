/*

Issues with current set up (using user.id as token):

-Simple token (user.id) is easy to guess and hack
-Developer is able to see the actual password in the database, i.e. not secure
-Password is accessible in the code itself, and being shared in the front end (browser)
-Password is in plain text!

These issues can be solved by using Json Web Tokens aka JWT, and bcrypt (hashing passwords).

*/