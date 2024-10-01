import React, { useEffect, useRef } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { useIonAlert } from '@ionic/react';
import { Storage } from '@capacitor/storage';
import url_api from '../constante';

const ChauffeurLocationTracker = () => {
    const [presentAlert] = useIonAlert();
    const watchId = useRef<string | null>(null);
  
    const updatePosition = async (latitude: number, longitude: number) => {
        try {
            const { value: token } = await Storage.get({ key: 'token' });
            console.log("Mise à jour de la position");
            const response = await fetch(`${url_api}/chauffeur/updateChauffeurPosition`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '1'
                },
                body: JSON.stringify({ latitude, longitude }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la position');
            }
        } catch (error) {
            console.error('Erreur:', error);
            presentAlert({
                header: 'Erreur',
                message: 'Impossible de mettre à jour votre position. Veuillez vérifier votre connexion.',
                buttons: ['OK'],
            });
        }
    };
  
    useEffect(() => {
        const startTracking = async () => {
            try {
                const permissionStatus = await Geolocation.checkPermissions();
                if (permissionStatus.location !== 'granted') {
                    await Geolocation.requestPermissions();
                }

                // Fonction pour récupérer la position
                const getCurrentPosition = async () => {
                    const position = await Geolocation.getCurrentPosition({
                        enableHighAccuracy: true,
                    });
                    console.log("Position actuelle:", position.coords.latitude, position.coords.longitude);
                    updatePosition(position.coords.latitude, position.coords.longitude);
                };

                // Démarrer le suivi initial
                await getCurrentPosition();

                const intervalId = setInterval(getCurrentPosition, 500); 

                watchId.current = await Geolocation.watchPosition(
                    { enableHighAccuracy: true, timeout: 10000 },
                    (position: Position | null) => {
                        if (position) {
                            console.log("Position:", position.coords.latitude, position.coords.longitude);
                            updatePosition(position.coords.latitude, position.coords.longitude);
                        }
                    }
                );

                // Nettoyer l'intervalle lors du démontage
                return () => {
                    clearInterval(intervalId);
                    if (watchId.current !== null) {
                        Geolocation.clearWatch({ id: watchId.current });
                    }
                };

            } catch (error) {
                console.error('Erreur de géolocalisation:', error);
                presentAlert({
                    header: 'Erreur',
                    message: 'Impossible d\'accéder à votre position. Veuillez vérifier vos paramètres de localisation.',
                    buttons: ['OK'],
                });
            }
        };

        startTracking();
    }, [presentAlert]);

    return null;
};

export default ChauffeurLocationTracker;
