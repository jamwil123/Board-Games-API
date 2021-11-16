const { use } = require("../app");
const db = require("../db");

exports.fetchAllUsers = () => {
  queryStr = `SELECT username FROM users`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.fetchOneUser = (username) => {
    return db.query(`SELECT username, avatar_url, name FROM users WHERE username = $1;`, [username.username]).then(({rows})=> {
        if(rows.length===0){
            return Promise.reject({status:400, msg:'Invalid datatype'})
        }
        return rows
    })
}
