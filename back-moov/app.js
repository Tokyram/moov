const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const db = require('./db');

const indexRouter = require('./routes/index');
const utilisateurRouter = require('./routes/utilisateurRoute');
const voitureRouter = require('./routes/voitureRoute');
const chauffeurVoitureRouter = require('./routes/chauffeurVoitureRoute');
const notificationRoutes = require("./routes/notificationRoutes");
const courseRouter = require('./routes/courseRoute');
const paiementRouter = require('./routes/paiementRoute');
const historique_course = require('./routes/historique_course_route');
const avis = require('./routes/avis_route');
const chauffeurRoutes = require('./routes/chauffeurRoute');
const voitureRoutes = require('./routes/voitureRoute');
const panneRoutes = require('./routes/panneRoute');
const traitementCourseRoute = require('./routes/traitementCourseRoute');
const tarifRoute = require('./routes/tarifsRoute');
const factureRoute = require('./routes/factureRoute');
const tokenDeviceUserRoute = require('./routes/tokenDeviceUserRoute');

const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;


// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors());  

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// Routes
app.use('/', indexRouter);

// Routes
app.use('/api/users', utilisateurRouter);
app.use('/api/cars', voitureRouter);
app.use('/api/cars_driver', chauffeurVoitureRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/firebase', express.static(path.join(__dirname, 'public/firebase')));
app.use('/api/courses', courseRouter);
app.use('/api/paiement', paiementRouter);
app.use('/api/historique_course', historique_course);
app.use('/api/avis', avis);
app.use('/api/chauffeur', chauffeurRoutes);
app.use('/api/voiture', voitureRoutes);
app.use('/api/panne', panneRoutes);
app.use('/api/traitementCourse', traitementCourseRoute);
app.use('/api/tarifs', tarifRoute);
app.use('/api/factures', factureRoute);
app.use('/api/token-device', tokenDeviceUserRoute);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).send('Page non trouvée');
});

// Appeler initDb avant de démarrer le serveur
db.initDb()
  .then(() => {
    console.log('Base de données initialisée avec succès');
    
    // Démarrage du serveur après l'initialisation de la base de données
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Erreur lors de l\'initialisation de la base de données:', err);
    process.exit(1); // Quitter en cas d'erreur critique d'initialisation
  });

module.exports = app;

// const sslServer={
//   // key: fs.readFileSync(path.join(__dirname, 'cert', 'private-key.pem')), 
//   // cert: fs.readFileSync(path.join(__dirname, 'cert', 'certificate.pem')), 
//   key: fs.readFileSync(path.join('cert/private-key.pem')), 
//   cert: fs.readFileSync(path.join('cert/certificate.pem')), 
// };

// https.createServer(sslServer, app).listen(port, () => console.log(`Serveur en cours d'exécution sur https://localhost:${port}`));
// Démarrage du serveur