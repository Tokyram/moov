const TokenDeviceUser = require("../models/tokenDeviceUser");

class TokenDeviceUserController {
    static async saveTokenUser(req, res) {
        const { token, utilisateur_id } = req.body;

        try {
            const save = await TokenDeviceUser.saveOrUpdateToken(utilisateur_id, token);
            res.status(201).json({ success: true, data: save });
        } catch(error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = TokenDeviceUserController;
