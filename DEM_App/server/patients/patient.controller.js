const express = require("express");
const router = express.Router();
const httpStatus = require("http-status");

const patientService = require("./patient.server");
const util = require("../util");

// Define the list of patients routes and matching handler methods.
router.post("/getpatients", getPatients);
router.post("/createNewPatient", createNewPatient);
router.post("/updatepatient", updatePatient);

// Export the routes defined here in this controller to the main server setup.
module.exports = router;


// Handles failed requests.
function invalidRequest(res) {
  const message = `Cannot process the request. ${httpStatus["400_MESSAGE"]}`;
  console.log(`Request faild( ${message} )`);
  return util.createErrorResponse(res, httpStatus.BAD_REQUEST, message);
}

// Faild attempt to retrieve the data
function faildResponce(res) {
    const message = `Cannot process the responce. ${httpStatus["400_MESSAGE"]}`;
    console.log(`Responce faild( ${message} )`);
    return util.createErrorResponse(res, httpStatus._MESSAGE, message);
  }

// Handles the requests that attempt to get list of patients of the givven doctor
function getPatients(req, res, next) {

  // Attempt to doctor's username from the request.
  let username = null;

  try {
    username = req.body.username;
    console.log(username);
    if(!username) {
      invalidRequest(res);
      return;
    }
  } catch (err) {
    console.log(err);
    invalidRequest(res);
    return;
  }

  
  patientService.getPatients(username, (err, data) => {
    
    if (!data) {
      faildResponce('Could not find any relavant data');
      return;
    }
  
    console.log('In getPatients in controller: before create Success: ', res);
    // We have a valid token so return a success response with a token.
    util.createSuccessResponse(res, data);
  });
}

// Handles the requests that attempt to create new patient
function createNewPatient(req, res, next) {

    // Attempt to doctor's username and new patients params from the request.
    let username = null;
    let lang_code = null;
    let sex = null;
    let age = null;

    try {
      username = req.body.username;
      lang_code = req.body.lang_code;
      sex = req.body.sex;
      age = req.body.age;
  
      if(!username || !lang_code) {
        invalidRequest(res);
        return;
      }
    } catch (err) {
      invalidRequest(res);
      return;
    }
  
    
    patientService.createNewPatient(lang_code, age, sex, username, (data) => {
      
      if (!data) {
        faildResponce('Could not find any relavant data');
        return;
      }
    
      // We have a valid token so return a success response with a token.
      util.createSuccessResponse(res, data);
    });
}

// Handles the requests that attempt to update patient
function updatePatient(req, res, next) {

    // Attempt to get doctor's username and patient's params from the request.
    let patient_id = null;
    let lang_code = null;
    let sex = null;
    let age = null;

    try {
      patient_id = req.body.patient_id;
      doctor_id = req.body.doctor_id;
      lang_code = req.body.lang_code;
      sex = req.body.sex;
      age = req.body.age;
  
      if(!lang_code) {
        invalidRequest(res);
        return;
      }
    } catch (err) {
      invalidRequest(res);
      return;
    }
  
    if (!patient_id) {
      /** If there is no patient_id it means that this is new patient beeing created */
      patientService.createNewPatient(lang_code, age, sex, doctor_id, (err,data) => {
      
        if (!data) {
          faildResponce('Could not find any relavant data');
          return;
        }

        util.createSuccessResponse(res, data);
      });
    } else {
      patientService.updatePatient(lang_code, age, sex, patient_id, (err,data) => {
      
        if (!data) {
          faildResponce('Could not find any relavant data');
          return;
        }

        util.createSuccessResponse(res, data);
      });
    }

    
}



