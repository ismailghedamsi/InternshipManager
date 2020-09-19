package com.power222.tuimspfcauppbj.controllers;

import com.power222.tuimspfcauppbj.controller.SecurityDemoController;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SecurityDemoController.class)
public class SecurityDemoControllerTests {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRepository userRepo;

    @Test
    void helloWorldTest() throws Exception {
        mvc.perform(get("/hello").contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello, world!")));
    }

    @Test
    void unauthenticatedPrivateHelloWorldTest() throws Exception {
        when(userRepo.findByUsername(any())).thenReturn(Optional.empty());

        mvc.perform(get("/hello/private").contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser("test")
    void authenticatedPrivateHelloWorldTest() throws Exception {
        when(userRepo.findByUsername(any())).thenReturn(Optional.of(User.builder()
                .enabled(true)
                .username("admin")
                .role("admin")
                .password("password")
                .build()));

        mvc.perform(get("/hello/private").contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Hello, private world!")));
    }
}
