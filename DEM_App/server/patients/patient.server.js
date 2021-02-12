const jwt = require("jsonwebtoken");
const config = require("../config.json");

// Create a reference to database.
const usersMySqlDatabase = require("../database/db.js");

// Get doctor id by doctor user_name
getDoctorIdByUsername = (username, result) => {
  let sql =`SELECT user_id FROM admin_users WHERE user_name = '${username}';`;  

  console.log(`SELECT user_id FROM admin_users WHERE user_name = '${username}'`);
  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    console.log(`Found doctor id '${res[0].id}'`);
    return result(null, res[0].user_id);
  });
}

// Get patients of the doctor by doctor username
getPatients = (username, result) => {
  console.log('Inside getPatients');
  let sql =`SELECT p.* FROM admin_users au, patients p WHERE au.user_name = '${username}' and au.user_id = p.doctor_id ORDER by updated_at DESC;`;
  
  console.log('Inside getPatients: ', sql);
  usersMySqlDatabase.query(sql, (err, res) => {

    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, res);
  });
}

// Add new patient to database.
createNewPatient = (lang_code, age, sex, doctor_id, result) => {

  getDoctorIdByUsername(doctor_id, (err,data) => {

    if (data) {
        let sql =`INSERT INTO patients(doctor_id, lang_code, age, sex) VALUES ('${data}', '${lang_code}', '${age}', '${sex}');`;
  
        usersMySqlDatabase.query(sql, (err, res) => {
          if (err) {
            console.log("error: ", err);
            return result(err, null);
          }
          console.log('Here');
          return result(null, true);
        });
    } else {
        return result(null, false);
    }
  });
  
}

// Update patient record with new data.
updatePatient = (lang_code, age, sex, patient_id, result) => {
  let sql =`UPDATE patients SET lang_code = '${lang_code}', age = '${age}', sex = '${sex}' WHERE patient_id = '${patient_id}';`;
  
  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, true);
  });
}

module.exports = {
  getPatients,
  createNewPatient,
  updatePatient
};
