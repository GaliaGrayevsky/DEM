const jwt = require("jsonwebtoken");
const config = require("../config.json");

// Create a reference to database.
const usersMySqlDatabase = require("../database/db.js");

// Check if the user exists in database (matching username and password) which we'll say is good enough to be authenticated.
doesUsernameAndPasswordExist = (username, password, result) => {
  let sql =`SELECT count(*) found_users FROM admin_users WHERE user_name = '${username}' and password = '${password}';`;

  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, res[0].found_users > 0);
  });
}

// Check if the user exists in database (matching username).
doesUsernameExist = (username, result) => {
  let sql =`SELECT count(*) found_users FROM admin_users WHERE user_name = '${username}';`;
  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, res[0].found_users > 0);
  });
}

// Add new user to database.
createNewUser = (username, password, firstname, lastname, result) => {
  let sql =`insert into admin_users(user_name, password, first_name, last_surname, email) values ('${username}','${password}','${firstname}','${lastname}', "none");`;
  
  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, true);
  });
}

// Create a token from a payload.
function createToken(payload) {
  const jwtConfig = {
    expiresIn: config.jwt.expiresIn
  };
  return jwt.sign(payload, config.jwt.secretKey, jwtConfig)
}

authenticate = (username, password, result) => {
  console.info(`authenticate( ${username} / ${password} )`);

  doesUsernameAndPasswordExist(username, password, (err,data) => {
    console.log("Recieved: ", data);
    if (data) {
      console.info(`authenticateSuccess( ${username} )`);
      return result(createToken({username, password}));
    } else {
      console.warn(`authenticateFault()`);
      return result(null);
    }
  })
}

register = (username, password, firstName, lastName, result) => {
  console.log(`register( register "${firstName} ${lastName}" with username and pw: ${username} / ${password} )`);
  
  console.log(result);

  doesUsernameExist(username, (err,data) => {
    console.log(result);
    if (!data) {
      console.info(`registerSuccess( ${username} )`);
      createNewUser(username, password, firstName, lastName, (err,data) => {
        console.log(result);
        if (data) {
          console.log("!!!!!!!!!");
          return result(createToken({username, password}));
        } else {
          console.warn(`registrationFault()`);
          return result(null);
        }
      });
      
    } else {
      console.warn(`registerFault( User "${username}" already exists. )`);
      return result(null);
    }

  });

}

module.exports = {
  authenticate,
  register
};
