const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../src/app");

describe("Project", () => {
  let mongoServer;
  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create();
    const URI = mongod.getUri();

    mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async (done) => {
    mongoose.disconnect(done);
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }
  });

  it("cannot create programmer without body", async () => {
    const responsePost = await request(app).post("/projects").send({});
    expect(responsePost.status).toBe(404);
  });

  it("cannot create programmer with one or two required body", async () => {
    const responsePost = await request(app).post("/projects").send({
      firstName: "rizky afwan",
      age: 27,
    });
    expect(responsePost.status).toBe(404);
  });

  it("create programmer", async () => {
    const responsePost = await request(app)
      .post("/projects")
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript"],
      });
    expect(responsePost.status).toBe(201);
    const responseGet = await request(app).get(`/projects/${responsePost.body._id}`);
    expect(responseGet.body.firstName).toBe("rizky afwan");
    expect(responseGet.body.lastName).toBe("austin");
  });

  it("get programmers", async () => {
    await request(app)
      .post("/projects")
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript"],
      });

    const responseGet = await request(app).get("/projects");
    expect(responseGet.status).toBe(200);
    expect(responseGet.body.length).toBe(1);
  });

  it("get programmer by id", async () => {
    const responsePost = await request(app)
      .post("/projects")
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript"],
      });
    const responseGet = await request(app).get(`/projects/${responsePost.body._id}`);
    expect(responseGet.status).toBe(200);
    expect(responseGet.body.firstName).toBe("rizky afwan");
  });

  it("cannot get programmer using invalid id", async () => {
    const responsePost = await request(app)
      .post("/projects")
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript"],
      });
    const responseGet = await request(app).get(`/projects/${responsePost.body._id + 1}`);
    expect(responseGet.status).toBe(404);
  });

  it("update programmer data", async () => {
    const responsePost = await request(app)
      .post("/projects")
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript"],
      });
    const responsePut = await request(app)
      .put(`/projects/${responsePost.body._id}`)
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript", "react js", "mongo db"],
      });
    expect(responsePut.status).toBe(200);
    const responseGet = await request(app).get(`/projects/${responsePost.body._id}`);
    expect(responseGet.body.programmingLanguages[0]).toBe("javascript");
    expect(responseGet.body.programmingLanguages[1]).toBe("react js");
    expect(responseGet.body.programmingLanguages[2]).toBe("mongo db");
  });

  it("can't delete programmer without providing user id", async () => {
    await request(app)
      .post("/projects")
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript"],
      });
    const responseDelete = await request(app).delete(`/projects`);
    expect(responseDelete.status).toBe(404);
  });

  it("delete programmer by id", async () => {
    const responsePost = await request(app)
      .post("/projects")
      .send({
        firstName: "rizky afwan",
        lastName: "austin",
        age: 27,
        programmingLanguages: ["javascript"],
      });
    const responseDelete = await request(app).delete(`/projects/${responsePost.body._id}`);
    expect(responseDelete.status).toBe(200);
  });
});
