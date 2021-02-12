const express = require("express");
const router = express.Router();
const httpStatus = require("http-status");

const testsService = require("./test.server");
const util = require("../util");

// Define the list of patients routes and matching handler methods.
router.post("/getTests", getTests);
router.post("/createTest", createTest);
router.post("/updateTest", updateTest);

router.post("/getSubTests", getSubTests);
router.post("/createSubTest", createSubTest);
router.post("/updateSubTests", updateSubTests);

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
function getTests(req, res, next) {
  console.log('Got to getTests');
  // Attempt to doctor's username from the request.
  let patient_id = null;

  try {
    patient_id = req.body.patient_id;
    console.log(patient_id);
    if(!patient_id) {
      invalidRequest(res);
      return;
    }
  } catch (err) {
    console.log(err);
    invalidRequest(res);
    return;
  }

  
  testsService.getTests(patient_id, (err, data) => {
    
    if (!data) {
      faildResponce('Could not find any relavant data');
      return;
    }
  
    util.createSuccessResponse(res, data);
  });
}

// Handles the requests that attempt to create new patient
function createTest(req, res, next) {

    // Attempt to doctor's username and new patients params from the request.
    let patient_id = null;

    try {
      patient_id = req.body.patient_id;
  
      if(!patient_id) {
        invalidRequest(res);
        return;
      }
    } catch (err) {
      invalidRequest(res);
      return;
    }
  
    console.log('Patient_id: ', patient_id);
    testsService.createTest(patient_id, (err, data) => {
      
      if (!data) {
        faildResponce('Could not find any relavant data');
        return;
      }
    
      // We have a valid token so return a success response with a token.
      util.createSuccessResponse(res, data);
    });
}

// Handles the requests that attempt to update patient
function updateTest(req, res, next) {

    // Attempt to get doctor's username and patient's params from the request.
    let test_id = null;
    let score = null;
    let comments = null;

    try {
      test_id = req.body.test_id;
      score = req.body.score;
      comments = req.body.comments;
  
      if(!test_id) {
        invalidRequest(res);
        return;
      }
    } catch (err) {
      invalidRequest(res);
      return;
    }
  
    testsService.updateTest(test_id, score, comments, (err,data) => {
      
      if (!data) {
        faildResponce('Could not find any relavant data');
        return;
      }

      util.createSuccessResponse(res, data);
    });

}

// Handles the requests that attempt to get list of patients of the givven doctor
function getSubTests(req, res, next) {

  // Attempt to get test id from the request.
  let test_id = null;

  try {
    test_id = req.body.test_id;
    console.log(test_id);
    if(!test_id) {
      invalidRequest(res);
      return;
    }
  } catch (err) {
    console.log(err);
    invalidRequest(res);
    return;
  }

  
  testsService.getSubTests(test_id, (err, data) => {
    
    if (!data) {
      faildResponce('Could not find any relavant data');
      return;
    }
  
    util.createSuccessResponse(res, data);
  });
}

// Handles the requests that attempt to create new sub test
function createSubTest(req, res, next) {

    // Attempt to doctor's username and new patients params from the request.
    let test_id = null;
    let sub_test_type_id = null;

    try {
      test_id = req.body.test_id;
      sub_test_type_id = req.body.sub_test_type_id;
  
      if(!test_id || !sub_test_type_id) {
        invalidRequest(res);
        return;
      }
    } catch (err) {
      invalidRequest(res);
      return;
    }
  
    
    testsService.createSubTest(test_id, sub_test_type_id, (data) => {
      
      if (!data) {
        faildResponce('Could not find any relavant data');
        return;
      }
    
      // We have a valid token so return a success response with a token.
      util.createSuccessResponse(res, data);
    });
}

// Handles the requests that attempt to update patient
function updateSubTests(req, res, next) {

    // Attempt to get doctor's username and patient's params from the request.
    let sub_tests = null;

    try {
      sub_tests = req.body.subTests;
  
      if(!sub_tests) {
        invalidRequest(res);
        return;
      }
    } catch (err) {
      invalidRequest(res);
      return;
    }
  
    testsService.updateSubTests(sub_tests, (err,data) => {
      
      if (!data) {
        faildResponce('Could not find any relavant data');
        return;
      }

      util.createSuccessResponse(res, data);
    });
}