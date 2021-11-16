const db = require('../index')
const format = require('pg-format')


seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data
  return db.query(`DROP TABLE IF EXISTS comments;`).then(() => {
    return db.query(`DROP TABLE IF EXISTS reviews;`).then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`).then(() => {
          return db.query(`DROP TABLE IF EXISTS categories;`);
        })
      })
    })
    .then(() => {
    return db.query(`CREATE TABLE categories 
    (slug VARCHAR(255) PRIMARY KEY,
      description VARCHAR(255)
      );`
      );
  })
  .then(() => {
    return db.query(`CREATE TABLE users 
    (username VARCHAR PRIMARY KEY UNIQUE,
      avatar_url VARCHAR(255),
      name VARCHAR(255)
      );`
      );
  })
  .then(() => {
    return db.query(`CREATE TABLE reviews 
    (review_id SERIAL PRIMARY KEY, 
      title VARCHAR(255), 
      review_body TEXT,
      designer VARCHAR(255),
      review_img_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT '0',
      category VARCHAR(255) REFERENCES categories(slug),
      owner VARCHAR(255) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
      );
  })
  .then(() => {
    return db.query(`CREATE TABLE comments 
    (comment_id SERIAL PRIMARY KEY, 
      author VARCHAR(255) REFERENCES users(username),
      review_id INT REFERENCES reviews(review_id),
      votes int DEFAULT '0',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR
      );`
      );
  }).then(() => {
    console.log("CREATED DB")
  }).then(()=> {
    console.log('INSERTING CATEGORIES')
    const queryStr = format(`INSERT INTO categories (slug, description)
    VALUES %L;`, categoryData.map((category)=> {
      return [category.slug,
              category.description
      ]
    }))
    return db.query(queryStr)
  }).then(() => {
    console.log('INSERTING USERS')
    const queryStr = format(`INSERT INTO users (username, avatar_url, name)
    VALUES %L;`, userData.map((user)=> {
      return [user.username,
              user.avatar_url,
              user.name
      ]
    }))
    return db.query(queryStr)
  }).then(()=> {
    console.log('INSERTING REVIEWS')
    const queryStr = format(`INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at)
    VALUES %L;`, reviewData.map((reviews)=> {
      return [reviews.title,
              reviews.review_body,
              reviews.designer,
              reviews.review_img_url,
              reviews.votes, 
              reviews.category,
              reviews.owner,
              reviews.created_at
      ]
    }))
    return db.query(queryStr)
  }).then(()=> {
    console.log('INSERTING COMMENTS')
    const queryStr = format(`INSERT INTO comments (author, review_id, votes, created_at, body)
    VALUES %L;`, commentData.map((comments)=> {
      return [comments.author,
              comments.review_id,
              comments.votes,
              comments.created_at,
              comments.body
      ]
    }))
    return db.query(queryStr)
  }).then(()=> {
    console.log('FINISHED INSERTING DATA')
  })


};

module.exports= {seed}

