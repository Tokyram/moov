CREATE TABLE IF NOT EXISTS utilisateur (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  telephone VARCHAR(255) UNIQUE NOT NULL,
  mail VARCHAR(255) NOT NULL,
  mdp VARCHAR(255) NOT NULL,
  adresse VARCHAR(255) NOT NULL,
  photo VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'UTILISATEUR',
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  est_banni BOOLEAN,
  date_banni TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS verification_code (
  id SERIAL PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  user_data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS voiture (
  id SERIAL PRIMARY KEY,
  marque VARCHAR(255) NOT NULL,
  modele VARCHAR(255) NOT NULL,
  immatriculation VARCHAR(10) UNIQUE NOT NULL,
  photo_url VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS chauffeur_voiture (
  id SERIAL PRIMARY KEY,
  chauffeur_id INT NOT NULL,
  voiture_id INT NOT NULL,
  date_affectation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE EXTENSION IF NOT EXISTS postgis;

-- Vérifiez que l'extension est bien activée :
SELECT PostGIS_version();

CREATE TABLE IF NOT EXISTS course (
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
CREATE INDEX IF NOT EXISTS idx_courses_depart ON course USING gist (
  ST_SetSRID(ST_MakePoint(adresse_depart_longitude, adresse_depart_latitude), 4326)
);
CREATE INDEX IF NOT EXISTS idx_courses_arrivee ON course USING gist (
  ST_SetSRID(ST_MakePoint(adresse_arrivee_longitude, adresse_arrivee_latitude), 4326)
);

CREATE TABLE IF NOT EXISTS confirmation_course_chauffeur (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL,
  chauffeur_id INT NOT NULL,
  date_confirmation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS paiement (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL,
  montant FLOAT NOT NULL,
  date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL,
  stripe_payment_intent_id VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS facture (
  id SERIAL PRIMARY KEY,
  paiement_id INT NOT NULL,
  montant FLOAT NOT NULL,
  date_facture TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avis (
  id SERIAL PRIMARY KEY,
  passager_id INT NOT NULL, 
  chauffeur_id INT NOT NULL,
  course_id INT NOT NULL, 
  etoiles INT CHECK (etoiles >= 1 AND etoiles <= 5), 
  commentaire TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  auteur VARCHAR(255) NOT NULL 
);


CREATE TABLE IF NOT EXISTS type_panne (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS panne (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT NOT NULL, 
    type_panne_id INT NOT NULL,  
    commentaire TEXT,
    date_signalement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_panne_id) REFERENCES type_panne(id)
);

ALTER TABLE panne ADD COLUMN resolu BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS position_chauffeur (
  id SERIAL PRIMARY KEY,
  chauffeur_id INT NOT NULL REFERENCES utilisateur(id),
  latitude DECIMAL(8,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_chauffeur_position UNIQUE (chauffeur_id)
);

-- Ajout d'un index GiST pour les requêtes géospatiales
CREATE INDEX IF NOT EXISTS idx_position_chauffeur ON position_chauffeur USING gist (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

CREATE OR REPLACE FUNCTION upsert_position_chauffeur(
  p_chauffeur_id INT,
  p_latitude DECIMAL(8,6),
  p_longitude DECIMAL(9,6)
) RETURNS VOID AS $$
BEGIN
  INSERT INTO position_chauffeur (chauffeur_id, latitude, longitude)
  VALUES (p_chauffeur_id, p_latitude, p_longitude)
  ON CONFLICT (chauffeur_id) 
  DO UPDATE SET 
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timestamp = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS traitement_course_utilisateur (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL,
  utilisateur_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS tarifs (
  id SERIAL PRIMARY KEY,
  tarif_par_km DECIMAL(10, 2) NOT NULL
);

CREATE OR REPLACE FUNCTION upsert_tarif(nouveau_tarif DECIMAL(10, 2))
RETURNS void AS $$
BEGIN
    INSERT INTO tarifs (id, tarif_par_km)
    VALUES (1, nouveau_tarif)
    ON CONFLICT (id)
    DO UPDATE SET tarif_par_km = EXCLUDED.tarif_par_km;
END;
$$ LANGUAGE plpgsql;

SELECT upsert_tarif(3000);

CREATE TABLE IF NOT EXISTS token_device_user (
  id SERIAL PRIMARY KEY,
  token_device TEXT,
  utilisateur_id INT
);

CREATE TABLE IF NOT EXISTS notification (
  id SERIAL PRIMARY KEY,
  utilisateur_id INT,
  contenu TEXT,
  date_heure_notification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lu BOOLEAN DEFAULT false,
  type_notif VARCHAR(255),
  entity_id INT
);