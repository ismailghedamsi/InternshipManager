package com.power222.tuimspfcauppbj.controllers;

import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Student;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.fail;

@ActiveProfiles("noSecurityTests")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FullContextStudentControllerTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private StudentRepository repository;

    private Student student;

    @BeforeEach
    void beforeEach() {
        student = Student.builder()
                .username("etudiant2")
                .password("password")
                .firstName("Bob")
                .lastName("Brutus")
                .studentId("1234")
                .email("power@gmail.ca")
                .phoneNumber("911")
                .address("9310 Lasalle")
                .build();
    }

    @AfterEach
    void afterEach() {
        repository.deleteAll();
    }

    @Test
    void udpateStudentTest() {
        ResponseEntity<Student> response = restTemplate.postForEntity("/students", student, Student.class);

        updateExpectedStudent(response);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(response.getBody(), is(equalTo(student)));

        student.setPhoneNumber("9");

        restTemplate.put("/students/" + student.getId(), student);

        response = restTemplate.getForEntity("/students/" + student.getId(), Student.class);
        assertThat(response.getBody(), is(equalTo(student)));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
    }

    @Test
    void deleteStudentTest() {
        ResponseEntity<Student> response = restTemplate.postForEntity("/students", student, Student.class);

        updateExpectedStudent(response);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(response.getBody(), is(equalTo(student)));

        restTemplate.delete("/students/" + student.getId());

        response = restTemplate.getForEntity("/students/" + student.getId(), Student.class);

        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.NOT_FOUND)));
    }

    @Test
    void verifierUsernameUniqueTest() {
        ResponseEntity<Student> response = restTemplate
                .withBasicAuth("admin", "password")
                .postForEntity("/students", student, Student.class);

        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.CREATED)));

        response = restTemplate.postForEntity("/students", student, Student.class);
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.CONFLICT)));
    }

    private void updateExpectedStudent(ResponseEntity<Student> response) {
        if (!response.hasBody())
            fail("Response body should no be empty");

        //noinspection ConstantConditions
        student.setId(response.getBody().getId());
        student.setRole("student");
        student.setEnabled(true);
    }
}
