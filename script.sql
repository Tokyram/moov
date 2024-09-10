CREATE TABLE utilisateur (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(70) NOT NULL,
  prenom VARCHAR(70) NOT NULL,
  telephone VARCHAR(70) UNIQUE NOT NULL,
  mail VARCHAR(70) NOT NULL,
  mdp VARCHAR(255) NOT NULL,
  adresse VARCHAR(70) NOT NULL,
  photo VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  est_banni BOOLEAN,
  date_banni TIMESTAMP WITH TIME ZONE
);

CREATE TABLE verification_code (
  id SERIAL PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  user_data JSONB NOT NULL
);

CREATE TABLE voiture (
  id SERIAL PRIMARY KEY,
  marque VARCHAR(255) NOT NULL,
  modele VARCHAR(255) NOT NULL,
  immatriculation VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE chauffeur_voiture (
  id SERIAL PRIMARY KEY,
  chauffeur_id INT NOT NULL,
  voiture_id INT NOT NULL,
  date_affectation TIMESTAMP NOT NULL
);