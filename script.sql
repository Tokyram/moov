CREATE TABLE utilisateur (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(70) NOT NULL,
  prenom VARCHAR(70) NOT NULL,
  telephone VARCHAR(70) UNIQUE NOT NULL,
  mail VARCHAR(70) NOT NULL,
  mdp VARCHAR(255) NOT NULL,
  adresse VARCHAR(70) NOT NULL,
  photo VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'UTILISATEUR',
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

CREATE EXTENSION IF NOT EXISTS postgis;

-- Vérifiez que l'extension est bien activée :
SELECT PostGIS_version();

CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  passager_id INT NOT NULL,
  chauffeur_id INT,
  date_heure_depart TIMESTAMP NOT NULL,
  adresse_depart_longitude DECIMAL(9,6) NOT NULL,
  adresse_depart_latitude DECIMAL(8,6) NOT NULL,
  adresse_depart TEXT NOT NULL,
  adresse_arrivee_longitude DECIMAL(9,6) NOT NULL,
  adresse_arrivee_latitude DECIMAL(8,6) NOT NULL,
  adresse_arrivee TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'EN ATTENTE',
  prix DECIMAL(10,2) NOT NULL,
  kilometre DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Ajout d'un index GiST pour les requêtes géospatiales
CREATE INDEX idx_courses_depart ON course USING gist (
  ST_SetSRID(ST_MakePoint(adresse_depart_longitude, adresse_depart_latitude), 4326)
);
CREATE INDEX idx_courses_arrivee ON course USING gist (
  ST_SetSRID(ST_MakePoint(adresse_arrivee_longitude, adresse_arrivee_latitude), 4326)
);

CREATE TABLE confirmation_course_chauffeur (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL,
  chauffeur_id INT NOT NULL,
  date_confirmation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL
);