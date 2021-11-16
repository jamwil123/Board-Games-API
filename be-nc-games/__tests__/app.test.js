const db = require("../db");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const { seed } = require("../db/seeds/seed.js");
const express = require("express");
const request = require("supertest");
const descriptionData = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Board Games API", () => {
  describe("/api/categories", () => {
    it("Status 200: GET all data from categories returns an array of objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories).toHaveLength(4);
          categories.forEach((categories) => {
            expect(categories).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    it("Status 404: when the wrong path is entered", () => {
      return request(app)
        .get("/api/categoriess")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Invalid URL" });
        });
    });
  });
  describe("/api/reviews/:review_id", () => {
    it("Status 200: GET specific data from reviews using a unique identifier (parametric endpoint)", () => {
      const REVIEW_ID = 3;
      return request(app)
        .get(`/api/reviews/${REVIEW_ID}`)
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toHaveLength(1);
          expect(reviews).toMatchObject([
            {
              owner: expect.any(Number),
              comment_count: expect.any(String),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            },
          ]);
        });
    });

    it("status 400: When passed an end point that isnt the correct data type", () => {
      const REVIEW_ID = "NO";
      return request(app)
        .get(`/api/reviews/${REVIEW_ID}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid datatype");
        });
    });
    it("status 404: When passed an end point that hasnt been logged in DB yet", () => {
      const REVIEW_ID = "999";
      return request(app)
        .get(`/api/reviews/${REVIEW_ID}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Entry not found");
        });
    });
    describe("PATCH", () => {
      it("Status 201: patches data to reviews using a parametric end point", () => {
        const REVIEW_ID = 3;
        const data = { inc_votes: 1 };
        const expectedData = {};
        return request(app)
          .patch(`/api/reviews/${REVIEW_ID}`)
          .send(data)
          .expect(201)
          .then(({ body }) => {
            expect(body.reviews).toEqual([
              {
                review_id: 3,
                title: "Ultimate Werewolf",
                review_body: "We couldn't find the werewolf!",
                designer: "Akihisa Okui",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                votes: 6,
                category: "social deduction",
                owner: "bainesface",
                created_at: "2021-01-18T10:01:41.251Z",
              },
            ]);
          });
      });
      it("status 400: If the wrong data type is added into the PATCH", () => {
        const REVIEW_ID = 3;
        const data = { inc_votes: "VALUE" };
        const expectedData = {};
        return request(app)
          .patch(`/api/reviews/${REVIEW_ID}`)
          .send(data)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid datatype");
          });
      });
      it("status 400: When passed an END POINT that isnt the correct data type", () => {
        const data = { inc_votes: 3 };
        const expectedData = {};
        const REVIEW_ID = "NO";
        return request(app)
          .patch(`/api/reviews/${REVIEW_ID}`)
          .send(data)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid datatype");
          });
      });
      it("status 404: When passed an end point that hasnt been logged in DB yet", () => {
        const REVIEW_ID = "999";
        const data = { inc_votes: 3 };
        return request(app)
          .patch(`/api/reviews/${REVIEW_ID}`)
          .send(data)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Entry not found");
          });
      });
    });
    describe("/api/reviews", () => {
      it("status 200: GETS all the reviews", () => {
        return request(app)
          .get(`/api/reviews`)
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toHaveLength(13);
            reviews.forEach((reviews) => {
              expect(reviews).toMatchObject({
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                review_body: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              });
            });
          });
      });
      it("Status 404: When the wrong path is entered ", () => {
        return request(app)
          .get("/api/reviewss")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Invalid URL" });
          });
      });
      describe("Querys on /api/reviews", () => {
        it("Status 200: Responds with an all objects when a query is passed", () => {
          return request(app)
            .get("/api/reviews?sort_by=title&&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toHaveLength(13);
              expect(body.reviews[0]).toEqual({
                review_id: 9,
                title: "A truly Quacking Game; Quacks of Quedlinburg",
                review_body:
                  "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
                designer: "Wolfgang Warsch",
                review_img_url:
                  "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
                votes: 10,
                category: "social deduction",
                owner: "mallionaire",
                created_at: "2021-01-18T10:01:41.251Z",
                comment_count: "0",
              });
            });
        });
        it("status 200: category is queried", () => {
          return request(app)
            .get("/api/reviews?category=euro game")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toEqual([
                {
                  review_id: 1,
                  title: "Agricola",
                  review_body: "Farmyard fun!",
                  designer: "Uwe Rosenberg",
                  review_img_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  votes: 1,
                  category: "euro game",
                  owner: "mallionaire",
                  created_at: "2021-01-18T10:00:20.514Z",
                  comment_count: "0",
                },
              ]);
            });
        });
        it("status 400: an invalid sort query has been entered possible SQL injection", () => {
          return request(app)
            .get("/api/reviews?sort_by=FAKEVALUE&&order=asc")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toEqual("Invalid sort query");
            });
        });
        it("status 400: an invalid order query has been entered possible SQL injection", () => {
          return request(app)
            .get("/api/reviews?sort_by=designer&&order=FAKEVALUE")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toEqual("Invalid order query");
            });
        });
        it("status 400: When passed an incorrect category query it will error", () => {
          return request(app)
            .get("/api/reviews?category=FAKECATEGORY")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toEqual("Invalid column query");
            });
        });
      });
    });
    describe("/api/reviews/:review_id/comments", () => {
      it("status 200: it finds the comments based upon the review_id", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            body.comments.forEach((comments) => {
              expect(comments).toMatchObject({
                comment_id: expect.any(Number),
                author: expect.any(String),
                review_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String),
              });
            });
          });
      });
      it("Status 404: When the wrong path is entered ", () => {
        return request(app)
          .get("/api/reviews/2/commentss")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Invalid URL" });
          });
      });
      it("status 400: When passed an end point that isnt the correct data type", () => {
        const REVIEW_ID = "NO";
        return request(app)
          .get(`/api/reviews/${REVIEW_ID}/comments`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid datatype");
          });
      });
      it("status 404: When passed an end point that hasnt been logged in DB yet", () => {
        const REVIEW_ID = "999";
        return request(app)
          .get(`/api/reviews/${REVIEW_ID}/comments`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Entry not found");
          });
      });
    });
    describe("POST /api/reviews/:review_id/comments", () => {
      it("status 201: It adds a new comment into the comments table", () => {
        const newComment = {
          username: "bainesface",
          body: "This is a new comment",
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            expect(body).toMatchObject([
              {
                comment_id: expect.any(Number),
                author: expect.any(String),
                review_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String),
              },
            ]);
          });
      });
      it("status 404: When the the URL is spelled wrong", () => {
        const newComment = {
          username: "bainesface",
          body: "This is a new comment",
        };
        return request(app)
          .post("/api/reviews/9/commentss")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
      it("status 400: When the username doesnt exist", () => {
        const newComment = {
          username: "bainesfac",
          body: "This is a new comment",
        };
        return request(app)
          .post("/api/reviews/9/commentss")
          .send(newComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid URL");
          });
      });
      it("status 400: When the wrong data type is entered into the body", () => {
        const newComment = { username: "bainesface", body: 1 };
        return request(app)
          .post("/api/reviews/9/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid data type");
          });
      });
      it("status 400: When a new entry is added that doesnt exist in the table", () => {
        const newComment = { username: "bainesface", body: 1, badger: true };
        return request(app)
          .post("/api/reviews/9/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid data type");
          });
      });
      describe("DELETE /api/comments/:comment_id", () => {
        it("Status 204: Deletes an entry from the comments using the comment_id", () => {
          return request(app)
            .delete("/api/comments/3")
            .expect(204)
            .then(({ body }) => {});
        });
        it("Status 404: When an invalid user id is entered", () => {
          return request(app)
            .delete("/api/comments/3333")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toEqual("User ID not found");
            });
        });
        it("Status 404: When an invalid URL is entered", () => {
          return request(app)
            .delete("/api/commentsss/3")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toEqual("Invalid URL");
            });
        });
        describe("PATCH /api/comments/:comment_id", () => {
          it("Status 201: A new object is patched into the db", () => {
            const newEntry = { inc_votes: 45 };
            return request(app)
              .patch("/api/comments/3")
              .send(newEntry)
              .expect(201)
              .then(({ body }) => {
                console.log(body[0]);
              });
          });
        });
      });
      describe("/api/", () => {
        it("Status 200: It responds with a JSON file of all the end points and what you can do on them", () => {
          return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual(descriptionData);
            });
        });
        it("Status 404: When an invalid user id is entered", () => {
          return request(app)
            .get("/apii")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toEqual("Invalid URL");
            });
        });
      });
      describe("/api/users", () => {
        it("Status 200: It responds with all users", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
              body.forEach((user) => {
                expect(user).toMatchObject({
                  username: expect.any(String),
                });
              });
            });
        });
        it("Status 404: The wrong URL is entered", () => {
          return request(app)
            .get("/api/userss")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toEqual("Invalid URL");
            });
        });
      });
      describe("/api/users/:username", () => {
        it("Status 200: It will return an object from the username", () => {
          return request(app)
            .get("/api/users/mallionaire")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual([
                {
                  username: "mallionaire",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                  name: "haz",
                },
              ]);
            });
        });
        it("Status 404: When the wrong URL is entered", () => {
          return request(app)
            .get("/api/usersss/mallionaire")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid URL");
            });
        });
        it("Status 400: When the wrong datatype is entered into the parametric endpoint", () => {
          return request(app)
            .get("/api/users/2323")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid datatype");
            });
        });
      });
    });
  });
});
