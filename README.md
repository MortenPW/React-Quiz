# PG6300 Exam - QuizBiz

Documentation for the PG6300 2018 exam on _Web Development and API Design_ for candidate number: 700005.

## How to run

#### Docker-compose:

- `docker-compose build`

- `docker-compose up`

* navigate to: [localhost:8080](http://localhost:8080)

## Technology

- Materialize.css for responsive design.

* Material Design Icons courtesy of Google.

- MongoDB for persistent user management.

* Passport local Mongoose strategy for session based cookie authentication (with salt and hash).

- Axios to retrieve rest-API trivia questions from opentdb.com. Backed by offline solution in case of failure.

* Babel bundled with Webpack for optimized JS with cross-browser compatibility.

- Redux with reducers and actions- mixed with state depending on distance between components.

* React-Router for routing addresses to components.

- WebSockets for server / client communication.

- Express for back-end interface, hosting API.

* NodeJS for back-end.

- Dockerized for ease of setup with database.

## Structure & features

#### Home / index

Simple landing page.

#### Quiz

Match users to quizzes. Create quiz or join quiz if available. If no username (not logged in), an anon-xx username is provided. Start quiz alone or when N-number of players have joined. If creator leaves the game, the game starts automatically.

##### Players & Scores

Displays usernames with scores. Button to leave current game.

Scores are time-based following the current formula to avoid random-answering being a good strategy: 100 - (elapsed milliseconds / 300).

Medium difficulty gives bonus of 15. Hard questions gives bonus of 30.

##### Quizzer

In quiz you get 10 questions with 4 possible answers within a timeframe of 10 seconds to answer each question. Winners are announced (if any) at end of game. Features questions and answers grabbed from opentdb.com with timer and buttons, including difficulties and categories for each question.

Re-match option when game has finished.

##### Quiz Chat

System messages and chat between connected users within current quiz.

#### High Scores

Incomplete. Just loads a sample page.

#### Forum

Post messages to forum- featuring pagination, add post, reply to post and delete post. Not fully completed (ie. not secured with authentication, posted by user).

#### Signup

Sign up to get username. Form with username, password and confirm password. Button to sign up.

#### Login

Log in user. Form with username / password, buttons to log in and sign up.

#### Log out

Log out user.

## Node.js

Running on port 8080.

#### Express API

Routing API for user authentication using Passport.

#### WebSockets

Communication between front-end and back-end mainly using WebSockets.
WebSockets are registered with logged in username or a random anon username provided.

#### MongoDB

Simple setup using Passport. The database attempts to connect via docker db, if this fails it will attempt localhost. This is mainly due to debugging on several machines.

I would probably not use MongoDB for such projects again unless needed, even though it handles authentication easily with Passport, it's quite hard to handle queries. MongoDB runs on port 27017.

#### Matches

Players may join existing matches if they haven't started- or they may create their own match. Matches grab questions and answers, send these to all players and wait for answers. Each user is provided a shuffled index of answers.

If a player leaves the game, his score is set to zero and all listeners are removed. If player is creator, a new Quiz-master is selected by the system. System messages are provided for various events such as players joining game, players leaving game or players wanting re-match, etc.

Changing default score, round time or the number of questions can easily be done.

Announcing winners happens at end of game, if several players have the same score, they will be tied (and mentioned). Then a re-match is prompted.

## Todos

- Add various options when creating quiz.

* Fix High Scores.

- Implement single point of string literal retrieval for simpler localization and adaptation to other languages.

* Various small bugs and minor errors:


    - Forum is reversed.



    - All stuff mentioned under features.

## Sources

Slides and examples from lecturer.

https://github.com/arcuri82/pg6300

https://materializecss.com/

https://fonts.googleapis.com/icon?family=Material+Icons

http://jasonwatmore.com/post/2017/03/14/react-pagination-example-with-logic-like-google

https://blog.cloudboost.io/creating-a-chat-web-app-using-express-js-react-js-socket-io-1b01100a8ea5

https://socket.io/docs/rooms-and-namespaces/

https://www.djamware.com/post/58bd823080aca7585c808ebf/nodejs-expressjs-mongoosejs-and-passportjs-authentication

https://www.npmjs.com/package/passport-local-mongoose

https://mherman.org/blog/user-authentication-with-passport-dot-js/

https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1

https://medium.com/gomycode/authentication-with-passport-js-73ca65b25feb

https://www.npmjs.com/package/bcrypt-nodejs

https://www.npmjs.com/package/html-entities

http://www.passportjs.org/docs/username-password/

https://medium.com/ai2-blog/dockerizing-a-react-application-3563688a2378?fbclid=IwAR3fQugSXiZkXNmCJPwUHBj_91s_7MnSShdv6TmzstGCDgzrZUR6iTccg6I
