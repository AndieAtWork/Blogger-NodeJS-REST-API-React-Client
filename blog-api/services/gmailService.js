const { google } = require("googleapis");
const oauth2Client = require("../config/googleOAuth");
const fs = require("fs");
const path = require("path");

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
});

async function sendEmail(to, subject, post) {

    var html = getNewPostTemplate(post);

    const email = [
        `From: ${process.env.GMAIL_USER}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=utf-8",
        "",
        html
    ].join("\r\n");

    const encodedMessage = Buffer
        .from(email)
        .toString("base64url");

    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage
        }
    });

    return response.data;
}

function getNewPostTemplate(post) {

    const templatePath = path.join(
        __dirname,
        "../views/email.html"
    );

    let html = fs.readFileSync(templatePath, "utf8");

    html = html
        .replace("{{TITLE}}", post.title)
        .replace("{{DESCRIPTION}}", post.content);

    return html;
}

module.exports = {
    sendEmail
};