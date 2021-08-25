const {OAuth2Client} = require('google-auth-library');
const {config} = require('../config/config');
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

class GoogleService{
    async verify(token) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
            return payload;
        } catch (error) {
            return error;
        }
    }
}

module.exports = GoogleService;