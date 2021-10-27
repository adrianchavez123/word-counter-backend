CREATE DATABASE WORD_COUNTER;
USE WORD_COUNTER;

CREATE TABLE PROFESSORS(
    professor_id varchar(100) not null PRIMARY KEY,
    username varchar(50)  null,
    name varchar(50)  null,
    email varchar(50)  unique not null,
    active boolean not null
)ENGINE = InnoDB;


CREATE TABLE STUDENTS(
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    student_id varchar(50) null,
    username varchar(50)not null,
    active boolean not null
)ENGINE = InnoDB;

CREATE TABLE GROUPS(
    group_id int NOT NULL,
    professor_id varchar(100) not null,
    student_id varchar(50) null,
    name varchar(50) not null,
    active boolean not null,
    token int,
    FOREIGN KEY (professor_id) REFERENCES PROFESSORS (professor_id)
)ENGINE = InnoDB;


CREATE TABLE EXERCISES(
    exercise_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(250) not null,
    description text null,
    words_amount int null,
    professor_id varchar(100) not null,
    exercise_image varchar(250),
    active boolean not null,
    FOREIGN KEY (professor_id) REFERENCES PROFESSORS (professor_id)
)ENGINE = InnoDB;


CREATE TABLE ASSIGNMENTS(
    assignment_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    create_at date not null,
    due_date date null,
    exercise_id int not null,
    group_id int not null,
    active boolean not null,
    FOREIGN KEY (exercise_id) REFERENCES EXERCISES (exercise_id)
)ENGINE = InnoDB;


CREATE TABLE DELIVER_ASSIGNMENTS(
    deliver_assignment_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    assignment_id int not null,
    student_id varchar(50),
    arrive_at date not null, 
    audio_URL varchar(250) not null,
    total_words_detected int null,
    active boolean not null,
    speech_to_text text null,
    FOREIGN KEY (assignment_id) REFERENCES ASSIGNMENTS (assignment_id)
)ENGINE = InnoDB;
