const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

class SMSService {
  constructor() {
    this.apiInstance = new SibApiV3Sdk.TransactionalSMSApi();
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error('BREVO_API_KEY is not set in the environment variables');
    }
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;
  }

  async sendVerificationCode(phoneNumber, code) {
    // Vérification basique du format du numéro de téléphone
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      console.error('Numéro de téléphone invalide:', phoneNumber);
      return false;
    }

    const sendSmsRequest = {
      sender: "YourApp",
      recipient: phoneNumber,
      content: `Votre code de vérification est : ${code}`
    };

    console.log('Envoi de SMS avec les paramètres:', JSON.stringify(sendSmsRequest));

    try {
      const response = await this.apiInstance.sendTransacSms(sendSmsRequest);
      console.log('Réponse de l\'API Brevo:', JSON.stringify(response));
      return true;
    } catch (error) {
      console.error("Erreur détaillée lors de l'envoi du SMS:", error.response ? error.response.text : error);
      return false;
    }
  }
}

// Fonction pour envoyer un SMS test
// async function sendTestSMS() {
//   const smsService = new SMSService();
//   const phoneNumber = '+261342131365'; // Remplacez par un numéro de téléphone valide
//   const code = '123456';
  
//   const result = await smsService.sendVerificationCode(phoneNumber, code);
//   console.log('Résultat de l\'envoi du SMS test:', result);
// }

// sendTestSMS();

module.exports = new SMSService();
