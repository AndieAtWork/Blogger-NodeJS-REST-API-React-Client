# BLOGGER
Blogger was originally an app (or rather two) I made for the Odin Project NodeJS course.
It is a simulation of how a blog is supposed to work, only with one (1) blog in existence, which is in control of an admin user. Those users that are not admins can only access the blog by logging in but not make changes other than posting comments.

Functionalities:
- Admin: post entries (just a title and text)
- Admin: publish entries and send an email through Google Cloud to other users describing the new entry
- Admin: edit entries
- Admin: add comments and remove comments from entries
- Users: add comments and remove the comments the current user made
- Users: create a new account
- Everyone: Log out
- Everyone: Log in
- There are status alerts everywhere in the api that the react responds to, like being automatically logged out after an hour (when the JWT expires)
- Though invalid options are not visible by a normal user, if they were, there would be a visible error and the action would not run.

Technologies used in NodeJS API:
- .env with database, jwt secret, a lot of google credentials
- Express (no sessions since that is handled by the client)
- CORS
- JWT
- Passport.js
- Google API and OAuth2Client from google-auth-library

Technologies used in React APP


<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif1.gif" width="500" />
</p>

<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif2.gif" width="500" />
</p>

<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif3.gif" width="500" />
</p>

<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif4.gif" width="500" />
</p>

Email sent after a post was published:
<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/mail.png?w=2048" width="500" />
</p>

Validations:
<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/validation1.png" width="500" />
</p>
<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/validation2.png" width="500" />
</p>
<p align="center">
  <img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/validation3.png" width="500" />
</p>

The alert that kicks you out!
