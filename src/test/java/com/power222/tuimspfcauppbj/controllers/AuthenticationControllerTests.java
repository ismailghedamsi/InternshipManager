package com.power222.tuimspfcauppbj.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.controller.AuthenticationController;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.model.dto.PasswordDTO;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.util.PasswordUpdateStatus;
import org.junit.jupiter.api.BeforeEach;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles({"noBootstrappingTests", "withSecurityTests"})
@WebMvcTest(AuthenticationController.class)
public class AuthenticationControllerTests {

    @MockBean
    private AuthenticationService authSvc;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    private PasswordDTO dto;

    @BeforeEach
    void beforeEach() {
        dto = PasswordDTO.builder()
                .oldPassword("password")
                .newPassword("motdepasse")
                .username("admin")
                .build();
    }

    @Test
    void unauthenticatedBasic() throws Exception {
        mvc.perform(get("/api/auth/user").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser("etudiant")
    void getUserInfos() throws Exception {
        User u = User.builder()
                .username("etudiant")
                .role("student")
                .password(new BCryptPasswordEncoder().encode("password"))
                .build();

        when(authSvc.getCurrentUser()).thenReturn(u);

        mvc.perform(get("/api/auth/user").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("etudiant"))
                .andExpect(jsonPath("$.role").value("student"));
    }

    @Test
    void successfulPasswordUpdateTest() throws Exception {
        when(authSvc.updateUserPassword(dto)).thenReturn(PasswordUpdateStatus.SUCCESS);

        mvc.perform(put("/api/auth/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto))).andExpect(status().isOk());
    }

    @Test
    void wrongOldPasswordUpdateTest() throws Exception {
        when(authSvc.updateUserPassword(dto)).thenReturn(PasswordUpdateStatus.OLD_WRONG);

        mvc.perform(put("/api/auth/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto))).andExpect(status().isUnauthorized());
    }

    @Test
    void identicalPasswordsUpdateTest() throws Exception {
        when(authSvc.updateUserPassword(dto)).thenReturn(PasswordUpdateStatus.OLD_AND_NEW_EQUAL);

        mvc.perform(put("/api/auth/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto))).andExpect(status().isConflict());
    }

    @Test
    void invalidUserPasswordUpdateTest() throws Exception {
        when(authSvc.updateUserPassword(dto)).thenReturn(PasswordUpdateStatus.USER_NOT_FOUND);

        mvc.perform(put("/api/auth/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto))).andExpect(status().isNotFound());
    }
}
