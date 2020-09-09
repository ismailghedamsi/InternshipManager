package com.power222.tuimspfcauppbj.controllers;

import com.power222.tuimspfcauppbj.UserController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void helloWorldTest() throws Exception {
        mvc.perform(get("/hello").contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello, world!")));
    }

    @Test
    void unauthenticatedPrivateHelloWorldTest() throws Exception {
        mvc.perform(get("/hello/private").contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isUnauthorized());
    }

    @WithMockUser("test")
    @Test
    void authenticatedPrivateHelloWorldTest() throws Exception {
        mvc.perform(get("/hello/private").contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello, private world!")));
    }
}
