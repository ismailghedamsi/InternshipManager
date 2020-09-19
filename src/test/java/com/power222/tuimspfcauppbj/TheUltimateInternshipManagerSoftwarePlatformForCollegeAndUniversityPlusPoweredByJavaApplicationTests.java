package com.power222.tuimspfcauppbj;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TheUltimateInternshipManagerSoftwarePlatformForCollegeAndUniversityPlusPoweredByJavaApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void contextLoads() {
        assertThat(restTemplate, is(notNullValue()));
    }

    @Test
    void helloWorldTest() {
        ResponseEntity<String> response = restTemplate.getForEntity("/hello", String.class);
		assertThat(response, is(notNullValue()));
		assertThat(response.getStatusCode(), is (equalTo(HttpStatus.OK)));
		assertThat(response.getBody(), is(equalTo("Hello, world!")));

    }

    @Test
    void unauthenticatedPrivateHelloWorldTest() {
		ResponseEntity<String> response = restTemplate.getForEntity("/hello/private", String.class);
		assertThat(response, is(notNullValue()));
		assertThat(response.getStatusCode(), is (equalTo(HttpStatus.UNAUTHORIZED)));
    }

    @Test
    void authenticatedPrivateHelloWorldTest() {
		ResponseEntity<String> response = restTemplate.withBasicAuth("admin", "password")
				.getForEntity("/hello/private", String.class);
		assertThat(response, is(notNullValue()));
		assertThat(response.getStatusCode(), is(equalTo(HttpStatus.OK)));
		assertThat(response.getBody(), is(equalTo("Hello, private world!")));
    }

    @Test
    void wrongUserPrivateHelloWorldTest() {
        ResponseEntity<String> response = restTemplate.withBasicAuth("totolehacker", "password")
                .getForEntity("/hello/private", String.class);
        assertThat(response, is(notNullValue()));
        assertThat(response.getStatusCode(), is(equalTo(HttpStatus.UNAUTHORIZED)));
    }

}
