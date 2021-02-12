// Create a reference to database.
const usersMySqlDatabase = require("../database/db.js");

// Get test of the patient_id
getTests = (patient_id, result) => {

  let sql =`SELECT t.* FROM tests t WHERE t.patient_id = '${patient_id}' ORDER by updated_at DESC;`;
  
  usersMySqlDatabase.query(sql, (err, res) => {

    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, res);
  });
}

// Add new test for given patient_id to database.
createTest = (patient_id, result) => {

  let sql =`INSERT INTO tests(patient_id) VALUES ('${patient_id}');`;
  
  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    console.log('Here');
    return result(null, true);
  });
}

// Update test record of patient with new data.
updateTest = (test_id, score, comments, result) => {
  let sql =`UPDATE tests SET score = '${score}', comments = '${comments}' WHERE test_id = '${test_id}';`;
  console.log(sql);
  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, true);
  });
}

/**
 * Subtest section
 */

// Get subtests of the test_id
getSubTests = (test_id, result) => {

  let sql =`SELECT st.* FROM subtests st WHERE st.test_id = '${test_id}' ORDER by updated_at DESC;`;
  
  usersMySqlDatabase.query(sql, (err, res) => {

    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, res);
  });
}

// Add new test for given patient_id to database.
createSubTest = (test_id, sub_test_type_id, result) => {

  let sql =`INSERT INTO subtests(test_id, sub_test_type_id) VALUES ('${test_id}', '${sub_test_type_id}');`;
  
  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }

    return result(null, true);
  });
}

// Update subtest record of test_id with new data.
updateSubTests = (sub_tests, result) => {
  let sql = '';

  console.log(sub_tests.length, sub_tests);
  /** Insert may occure only when an update happens for the first time, so this should be done for all rows */
  if (!sub_tests[0].sub_test_id) {
    sql +=`INSERT INTO subtests(test_id, sub_test_type_id, audio, audio_text, time, additions, deletions, substitutions, transpositions, mistakes_list) VALUES`;
  }

  for (let i = 0; i < sub_tests.length; i++){
    let current_sub_test = sub_tests[i];
    console.log('Current sub test: ', current_sub_test);
    if (!current_sub_test.sub_test_id){
       sql += ` ('${current_sub_test.test_id}', '${current_sub_test.sub_test_type_id}', '${current_sub_test.audio}', '${current_sub_test.audio_text}', '${current_sub_test.time}', '${current_sub_test.additions}', '${current_sub_test.deletions}', '${current_sub_test.substitutions}', '${current_sub_test.transpositions}', '${current_sub_test.mistakes_list}')`;
       if (i < sub_tests.length - 1){
        sql += ',';
       }
       console.log(sql);
    } else {
      sql +=`UPDATE subtests SET audio = '${current_sub_test.audio}', audio_text = '${current_sub_test.audio_text}', time = '${current_sub_test.time}', additions = '${current_sub_test.additions}', deletions = '${current_sub_test.deletions}', substitutions = '${current_sub_test.substitutions}', transpositions = '${current_sub_test.transpositions}', mistakes_list = '${current_sub_test.mistakes_list}' WHERE sub_test_id = '${current_sub_test.sub_test_id}';`;
    }
  }

  console.log('Here we are: ',sql);

  usersMySqlDatabase.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, true);
  });
}

module.exports = {
  getTests,
  createTest,
  updateTest,
  getSubTests,
  createSubTest,
  updateSubTests
};
