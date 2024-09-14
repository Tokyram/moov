
var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://moov-bc04a-default-rtdb.firebaseio.com"
});

// Exportez l'instance de messaging pour l'utiliser ailleurs dans votre code
module.exports = admin;