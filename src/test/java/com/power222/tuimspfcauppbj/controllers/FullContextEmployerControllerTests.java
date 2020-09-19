package com.power222.tuimspfcauppbj.controllers;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.model.Employer;
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
public class FullContextEmployerControllerTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private EmployerRepository employerRepo;

    private Employer expected;

    @BeforeEach
    private void beforeEach() {
        expected = Employer.builder()
                .username("employer")
                .password("password")
                .companyName("AL")
                .contactName("emp1")
                .phoneNumber("0123456789")
                .address("123claurendeau")
                .email("123@claurendeau.qc.ca")
                .build();
    }

    @AfterEach
    private void afterEach() {
        employerRepo.deleteAll();
    }

    @Test
    void updateEmployerTest() {

        ResponseEntity<Employer> response = restTemplate.withBasicAuth("admin", "password")
                .postForEntity("/employers", expected, Employer.class);

        updateOldEmp(response);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.CREATED)));
        assertThat(response.getBody(), is(equalTo(expected)));

        expected.setPhoneNumber("9876543210");

        restTemplate.withBasicAuth("admin", "password")
                .put("/employers/" + expected.getId(), expected);

        response = restTemplate.withBasicAuth("admin", "password")
                .getForEntity("/employers/" + expected.getId(), Employer.class);

        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(response.getBody(), is(equalTo(expected)));
    }

    @Test
    void deleteEmployerTest() {

        ResponseEntity<Employer> response = restTemplate.withBasicAuth("admin", "password")
                .postForEntity("/employers", expected, Employer.class);

        updateOldEmp(response);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(response.getBody(), is(equalTo(expected)));

        restTemplate.withBasicAuth("admin", "password")
                .delete("/employers/" + expected.getId());

        response = restTemplate.withBasicAuth("admin", "password")
                .getForEntity("/employers/" + expected.getId(), Employer.class);

        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.NOT_FOUND)));
    }

    @Test
    void verifierUsernameUnique() {

        ResponseEntity<Employer> response = restTemplate.postForEntity("/employers", expected, Employer.class);
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.CREATED)));

        response = restTemplate.withBasicAuth("admin", "password")
                .postForEntity("/employers", expected, Employer.class);
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.CONFLICT)));

    }

    private void updateOldEmp(ResponseEntity<Employer> response) {
        if (!response.hasBody())
            fail("Response body should no be empty");

        //noinspection ConstantConditions
        expected.setId(response.getBody().getId());
        expected.setRole("employer");
        expected.setEnabled(true);
    }
}
