
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Course = require('../models/course');
const Paiement = require('../models/paiement');
const Facture = require('../models/facture');

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
                
                // Enregistrer le paiement
                const paiement = await Paiement.create({
                    course_id: courseId,
                    montant: montantAriary,
                    status: 'COMPLETED',
                    stripe_payment_id: paymentIntentId,
                    stripe_charge_id: paymentIntent.charges.data[0].id
                });

                // Créer la facture
                const facture = await Facture.create({
                    paiement_id: paiement.id,
                    montant: paiement.montant,
                    stripe_invoice_id: paymentIntent.invoice,
                    stripe_invoice_url: paymentIntent.charges.data[0].receipt_url
                });

                // Attribuer la course au chauffeur
                await Course.attribuerChauffeur(courseId, chauffeurId);

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