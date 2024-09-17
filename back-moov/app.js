const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const indexRouter = require('./routes/index');
const utilisateurRouter = require('./routes/utilisateurRoute');
const voitureRouter = require('./routes/voitureRoute');
const chauffeurVoitureRouter = require('./routes/chauffeurVoitureRoute');
const notificationRoutes = require("./routes/notificationRoutes");
const courseRouter = require('./routes/courseRoute');
const paiementRouter = require('./routes/paiementRoute');
const historique_course = require('./routes/historique_course_route');
const avis = require('./routes/avis_route');

const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;


// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(cors({
//   origin: 'https://1ac8-41-74-208-240.ngrok-free.app', // ou l'origine spécifique de votre application
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type']
// }));
app.use(cors());  
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));

// const corsOptions = {
//   origin: ['https://localhost', 'https://f48b-41-74-208-240.ngrok-free.app'], // Ajoute ici les origines autorisées
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));
// app.use(cors({ origin: '*' }));

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

// Endpoint pour recevoir et enregistrer le token FCM
app.post('/api/save-token', (req, res) => {
  const { token } = req.body;
  
  if (token) {
    // Affiche le token dans la console
    console.log('Token reçu du client:', token);
    
    // Sauvegardez le token dans votre base de données ici si nécessaire
    // Exemple: saveTokenToDatabase(token);
    
    // Réponse de succès
    res.status(200).send('Token reçu avec succès');
  } else {
    console.error('Aucun token reçu');
    res.status(400).send('Erreur : Aucun token envoyé');
  }
});
// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).send('Page non trouvée');
});


app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
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