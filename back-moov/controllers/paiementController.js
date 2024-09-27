
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Course = require('../models/course');
const Paiement = require('../models/paiement');
const Facture = require('../models/facture');
const TraitementCourseUtilisateur = require('../models/traitementCourseUtilisateur');

const TAUX_CHANGE_EUR_MGA = 5000; // 1 EUR = 5000 MGA

class PaiementController {
    static async initierPaiement(req, res) {
        try {
          const { courseId, chauffeurId, montantAriary } = req.body;
    
          // Conversion Ariary vers Euro
          const montantEuro = montantAriary / TAUX_CHANGE_EUR_MGA;
          const montantCentimes = Math.round(montantEuro * 100);
    
          // Créer une intention de paiement avec Stripe
          const paymentIntent = await stripe.paymentIntents.create({
            amount: montantCentimes,
            currency: 'eur',
            metadata: { courseId, chauffeurId, montantAriary: montantAriary.toString() }
          });
    
          res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            montantEuro: montantEuro.toFixed(2),
            montantAriary
          });
        } catch (error) {
          console.error('Erreur lors de l\'initiation du paiement:', error);
          res.status(500).json({ success: false, message: 'Erreur lors de l\'initiation du paiement', error: error.message });
        }
    }

    static async confirmerPaiement(req, res) {
        try {
            const { paymentIntentId } = req.body;
            
            // Récupérer les détails du paiement depuis Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            
            if (paymentIntent.status === 'succeeded') {
                const { courseId, chauffeurId, montantAriary } = paymentIntent.metadata;
                
                console.log('PaymentIntent:', JSON.stringify(paymentIntent, null, 2));

                // Enregistrer le paiement
                const paiement = await Paiement.create({
                    course_id: courseId,
                    montant: montantAriary,
                    status: 'COMPLETED',
                    stripe_payment_id: paymentIntentId
                });

                // Créer la facture
                const facture = await Facture.create({
                    paiement_id: paiement.id,
                    montant: paiement.montant
                });

                // Attribuer la course au chauffeur
                await Course.attribuerChauffeur(courseId, chauffeurId);
                const suppressionTraitement = TraitementCourseUtilisateur.suppressionTraitementCourse(courseId);
                const suppressionConfirmation = Course.suppressionCourseChauffeur(courseId);
                
                res.status(200).json({
                    success: true,
                    message: 'Paiement confirmé et course attribuée',
                    data: { paiement, facture }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Le paiement n\'a pas réussi'
                });
            }
        } catch (error) {
            console.error('Erreur lors de la confirmation du paiement:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la confirmation du paiement', 
                error: error.message 
            });
        }
    }
}

module.exports = PaiementController;