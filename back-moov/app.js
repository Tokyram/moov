const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const utilisateurRouter = require('./routes/utilisateurRoute');
const voitureRouter = require('./routes/voitureRoute');
const chauffeurVoitureRouter = require('./routes/chauffeurVoitureRoute');


const app = express();
const port = 3000;

// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);

// Utilisateurs routes
app.use('/api/users', utilisateurRouter);
app.use('/api/cars', voitureRouter);
app.use('/api/cars_driver', chauffeurVoitureRouter);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).send('Page non trouvée');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

module.exports = app;