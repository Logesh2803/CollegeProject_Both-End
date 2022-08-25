
var admin = require("firebase-admin");

var serviceAccount = require("./all-in-one-24eca-firebase-adminsdk-mkgt8-98caef6ba9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.firestore().settings({
  ignoreUndefinedProperties : true
})
module.exports = admin;
