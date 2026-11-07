# BLOGGER
Blogger was originally an app (or rather two) I made for the Odin Project NodeJS course.
It is a simulation of how a blog is supposed to work, only with one (1) blog in existence, which is in control of an admin user. Those users that are not admins can only access the blog by logging in but not make changes other than posting comments.

Functionalities:
- Admin: post entries which start as private until published (just a title and text)
- Admin: publish entries and send an email through Google Cloud to other users describing the new entry
- Admin: edit entries
- Admin: add comments and remove comments from entries
- Users: add comments and remove the comments the current user made
- Users: create a new account
- Everyone: Log out
- Everyone: Log in
- The API returns status codes and messages that the React application handles to display appropriate notifications and feedback, like being automatically logged out after an hour (when the JWT expires)
- Access control: Although unauthorized options are not visible to regular users, the API independently validates permissions. Any unauthorized action returns an error and is never executed.
- For example, using Postman won't get you anywhere without the token you need credentials to get, and then will only let you perform the actions your admin status offers.

Technologies used in NodeJS API:
- .env with database, jwt secret, a lot of google credentials
- Express (no sessions since that is handled by the client)
- CORS
- JWT
- Passport.js
- bcryptjs
- Google Cloud, Google API and OAuth2Client from google-auth-library
- Postgres

Technologies used in React APP
- Stores the JWT and user-related information locally. Although users can modify this information (through LocalStorage if they know how), it does not grant additional permissions, since the API independently validates authentication and authorization on every protected request.
- Importing Sweetalert2
- Route: To manage urls
- Navigate: A client that is not logged in can't enter. A client that is logged in can't go outside (login page, for example) without logging out.
- useState
- useRef
- useEffect
- useNavigate
- useParams
- BrowserRouter, Routes, Route
- Fetch requests
- LocalStorage
- Handling of forms

<p>Logging in as admin, posting and publishing a post.</p>
<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif1.gif" width="500" />

<p>Editing and deleting a post</p>
<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif2.gif" width="500" />

<p>Signing up with a new account</p>
<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif3.gif" width="500" />

<p>Using this account to post a comment and then deleting it</p>
<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/gif4.gif" width="500" />

<p>Email sent after a post was published:</p>
<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/mail.png?w=2048" width="500" />

<p>Validations:</p>
<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/validation1.png" width="500" />

<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/validation2.png" width="500" />

<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/validation3.png" width="500" />

<p>The alert that kicks you out!</p>
<img src="https://andieatwork.wordpress.com/wp-content/uploads/2026/11/expired.png" width="500" />

