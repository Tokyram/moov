require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

class SMSService {
  static sendSMS(to, body) {
    //Vérification basique du format du numéro de téléphone
    if (!/^\+?[1-9]\d{1,14}$/.test(to)) {
      console.error('Numéro de téléphone invalide:', phoneNumber);
      return false;
    }
    try {
      const response = client.messages.create({
        body: body,
        from: '+12673610516',
        to: to
      });
      return true;
    }catch (error) {
      console.error("Erreur détaillée lors de l'envoi du SMS:", error.response ? error.response.text : error);
      return false;
    }
    
  }
}

module.exports = SMSService;
