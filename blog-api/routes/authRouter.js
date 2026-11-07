const { Router } = require("express");
const router = Router();

const oauth2Client = require("../config/googleOAuth");

router.get("/google", (req, res) => {

    console.log("GOOGLE")

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/gmail.send"
        ],
        prompt: "consent"
    });

    res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {

    console.log("GOOGLE CALLBACK")

    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);

        console.log(tokens);

        res.send("OAuth authorization successful!");

    } catch (error) {
        console.error(error);
        res.status(500).send("OAuth authorization failed");
    }
});

module.exports = router;