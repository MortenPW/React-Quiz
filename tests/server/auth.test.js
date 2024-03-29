const request = require("supertest");
const app = require("../../src/server/app");
const User = require("../../src/server/database/user");

// Tests taken from course as examples.

/*
    Useful during debugging. By default, when there is an internal
    500 error, Express does not show you anything.
    So, here we print the stack-trace
 */

const errorHandler = function(err, req, res, next) {
  console.log(err.stack);
  res.send(500);
};
app.use(errorHandler);

beforeEach(() => {
  //User.resetAllUsers();
});

test("Test failed login", async () => {
  const response = await request(app)
    .post("/api/login")
    .send({ username: "foo", password: "123" });

  expect(response.statusCode).toBe(401);
});

test("Test sign up", async () => {
  const response = await request(app)
    .post("/api/signup")
    .send({ username: "foo", password: "123" });

  expect(response.statusCode).toBe(204);
});

test("Test fail sign up twice", async () => {
  const payload = { username: "foo", password: "123" };

  let response = await request(app)
    .post("/api/signup")
    .send(payload);
  expect(response.statusCode).toBe(204);

  //can't sign up twice with same username
  response = await request(app)
    .post("/api/signup")
    .send(payload);
  expect(response.statusCode).toBe(400);
});

test("Test logged in when signing up", async () => {
  const payload = { username: "foo", password: "123" };

  let response = await request(app).get("/api/user");
  expect(response.statusCode).toBe(401);

  response = await request(app)
    .post("/api/signup")
    .send(payload);
  expect(response.statusCode).toBe(204);
  const cookie = response.headers["set-cookie"];

  //now we should be able to get it
  response = await request(app)
    .get("/api/user")
    .set("cookie", cookie);
  expect(response.statusCode).toBe(200);
  expect(response.body.username).toBe(payload.username);
});

test("Test sign up, and then login", async () => {
  const payload = { username: "foo", password: "123" };

  let response = await request(app).get("/api/user");
  expect(response.statusCode).toBe(401);

  response = await request(app)
    .post("/api/signup")
    .send(payload);
  expect(response.statusCode).toBe(204);

  response = await request(app)
    .post("/api/login")
    .send(payload);
  expect(response.statusCode).toBe(204);
  const cookie = response.headers["set-cookie"];

  //now we should be able to get it
  response = await request(app)
    .get("/api/user")
    .set("cookie", cookie);
  expect(response.statusCode).toBe(200);
  expect(response.body.username).toBe(payload.username);
});

test("Test login with wrong password", async () => {
  const username = "foo";
  const password = "123";
  const payload = { username, password };

  let response = await request(app)
    .post("/api/signup")
    .send(payload);
  expect(response.statusCode).toBe(204);

  response = await request(app)
    .post("/api/login")
    .send({ username, password: "a wrong password" });
  expect(response.statusCode).toBe(401);

  response = await request(app)
    .post("/api/login")
    .send(payload);
  expect(response.statusCode).toBe(204);
});

test("Test logout", async () => {
  const payload = { username: "foo", password: "123" };

  let response = await request(app)
    .post("/api/signup")
    .send(payload);
  expect(response.statusCode).toBe(204);
  const cookie = response.headers["set-cookie"];

  //now we should be able to get it
  response = await request(app)
    .get("/api/user")
    .set("cookie", cookie);
  expect(response.statusCode).toBe(200);

  await request(app)
    .post("/api/logout")
    .set("cookie", cookie)
    .send();

  //the cookie is no longer valid now after a logout
  response = await request(app)
    .get("/api/user")
    .set("cookie", cookie);
  expect(response.statusCode).toBe(401);
});

test("Test get token", async () => {
  let response = await request(app)
    .post("/api/signup")
    .send({ username: "foo", password: "123" });
  expect(response.statusCode).toBe(204);
  const cookie = response.headers["set-cookie"];

  //can't get token without cookie
  response = await request(app).post("/api/wstoken");
  //no cookie
  expect(response.statusCode).toBe(401);

  response = await request(app)
    .post("/api/wstoken")
    .set("cookie", cookie);
  expect(response.statusCode).toBe(201);
  expect(response.body.wstoken).toBeDefined();
  const first = response.body.wstoken;

  response = await request(app)
    .post("/api/wstoken")
    .set("cookie", cookie);
  expect(response.statusCode).toBe(201);
  expect(response.body.wstoken).toBeDefined();
  const second = response.body.wstoken;

  //each time should get a new token
  expect(first).not.toBe(second);
});
