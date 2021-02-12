/** Creating DEM schema */

create database DEM;
grant all privileges on DEM.* to root@localhost identified by 'toor';

/** setting to user DEM database */
USE DEM;

/** Drop all tables */
DROP TABLE subtests;
DROP TABLE tests;
DROP TABLE patients;
DROP TABLE admin_users;
DROP TABLE testtypes;


/** Creating tables */

CREATE TABLE IF NOT EXISTS testtypes (
    test_type_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL
)  ENGINE=INNODB;

INSERT INTO testtypes(title) VALUES('Vertical A');
INSERT INTO testtypes(title) VALUES('Vertical B');
INSERT INTO testtypes(title) VALUES('Horizontal');

/** Admin USers */
CREATE TABLE IF NOT EXISTS admin_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_surname VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;

/** Patients */
CREATE TABLE IF NOT EXISTS patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT,
    lang_code VARCHAR(20) NOT NULL,
    age INT,
    sex VARCHAR(20) NOT NULL,    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor_id
    FOREIGN KEY (doctor_id) 
    REFERENCES admin_users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
)  ENGINE=INNODB;

/** Tests table to hold list of tests performed on users */
CREATE TABLE IF NOT EXISTS tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    score FLOAT,
    comments TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patient_id
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE    
)  ENGINE=INNODB;

/** Subtest */
CREATE TABLE IF NOT EXISTS subtests (
    sub_test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT,
    sub_test_type_id INT,
    audio TEXT,    
    audio_text TEXT,
    time FLOAT,
    additions INT,
    deletions INT,
    substitutions INT,
    transpositions INT,
	mistakes_list TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_test_id
    FOREIGN KEY (test_id) 
    REFERENCES tests(test_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_sub_test_type_id
    FOREIGN KEY (sub_test_type_id) 
    REFERENCES testtypes(test_type_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
)  ENGINE=INNODB;

