package com.power222.tuimspfcauppbj;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.LinkedHashMap;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    private MultiValueMap<String, String> headers;

    @BeforeEach
    void beforeEach() {
        headers = new LinkedMultiValueMap<>();
        headers.add("X-Semester", "a2020h2021");
    }

    @Test
    void contextLoads() {
        assertThat(restTemplate, is(notNullValue()));
    }

    @Test
    void helloWorldTest() {
        ResponseEntity<String> response = restTemplate.exchange("/api/hello", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(response.getBody(), is(equalTo("Hello, world!")));
    }

    @Test
    void unauthenticatedPrivateHelloWorldTest() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/hello/private", String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.UNAUTHORIZED)));
    }

    @Test
    void authenticatedPrivateHelloWorldTest() {
        ResponseEntity<String> response = restTemplate.withBasicAuth("employeur", "password")
                .exchange("/api/hello/private", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(response.getBody(), is(equalTo("Hello, private world!")));
    }

    @Test
    void wrongUserPrivateHelloWorldTest() {
        ResponseEntity<String> response = restTemplate.withBasicAuth("totolehacker", "password")
                .getForEntity("/api/hello/private", String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.UNAUTHORIZED)));
    }

    @Test
    void missingSemesterHeaderTest() {
        headers = new LinkedMultiValueMap<>();

        ResponseEntity<String> response = restTemplate
                .withBasicAuth("admin", "password")
                .exchange("/api/students", HttpMethod.GET, new HttpEntity<Void>(headers), String.class);

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.BAD_REQUEST)));
        assertThat(response.getBody(), is(equalTo("{\"error\": \"X-Semester header missing or malformed\"}")));
    }

    @Test
    void getResumeForFirstSemester() {
        headers = new LinkedMultiValueMap<>();
        headers.add("X-Semester", "a2020h2021");

        ResponseEntity<List> response = restTemplate
                .withBasicAuth("admin", "password")
                .exchange("/api/resumes", HttpMethod.GET, new HttpEntity<Void>(headers), List.class);

        List<LinkedHashMap> resumes = response.getBody();

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(resumes.get(0).get("name"), is(equalTo("Bootstrapped Resume")));
    }

    @Test
    void getResumeForSecondSemester() {
        headers = new LinkedMultiValueMap<>();
        headers.add("X-Semester", "a2021h2022");

        ResponseEntity<List> response = restTemplate
                .withBasicAuth("admin", "password")
                .exchange("/api/resumes", HttpMethod.GET, new HttpEntity<Void>(headers), List.class);

        List<LinkedHashMap> resumes = response.getBody();

        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
        assertThat(resumes.get(0).get("name"), is(equalTo("Bootstrapped Resume with diff. Semester")));
    }
}
