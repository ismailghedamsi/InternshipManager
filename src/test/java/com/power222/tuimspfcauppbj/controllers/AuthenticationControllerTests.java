package com.power222.tuimspfcauppbj.controllers;

import com.power222.tuimspfcauppbj.controller.AuthenticationController;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles({"noBootstrappingTests", "withSecurityTests"})
@WebMvcTest(AuthenticationController.class)
public class AuthenticationControllerTests {

    @MockBean
    private AuthenticationService authSvc;

    @Autowired
    private MockMvc mvc;

    @Test
    void unauthenticatedBasic() throws Exception {
        mvc.perform(get("/auth/basic").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser("etudiant")
    void authenticatedBasic() throws Exception {
        when(authSvc.getCurrentUser()).thenReturn(User.builder()
                .enabled(true)
                .username("etudiant")
                .role("student")
                .password(new BCryptPasswordEncoder().encode("password"))
                .build());

        mvc.perform(get("/auth/basic").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("{ message: \"Login successful\" }"));
    }

    @Test
    @WithMockUser("etudiant")
    void getUserInfos() throws Exception {
        User u = User.builder()
                .enabled(true)
                .username("etudiant")
                .role("student")
                .password(new BCryptPasswordEncoder().encode("password"))
                .build();

        when(authSvc.getCurrentUser()).thenReturn(u);

        mvc.perform(get("/auth/user").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("etudiant"))
                .andExpect(jsonPath("$.role").value("student"))
                .andExpect(jsonPath("$.enabled").value(true));
    }
}
