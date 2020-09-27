package com.power222.tuimspfcauppbj.controllers;

import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.controller.ResumeController;
import com.power222.tuimspfcauppbj.model.Resume;
import com.power222.tuimspfcauppbj.service.ResumeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;


@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import(TestsWithoutSecurityConfig.class)
@WebMvcTest(ResumeController.class)
class ResumeControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ResumeService svc;

    @Test
    void getResumeFound() throws Exception {
        when(svc.getResumeById(anyLong())).thenReturn(Optional.of(new Resume()));

        var actual = mvc.perform(get("/resumes/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void getResumeNotFound() throws Exception {
        when(svc.getResumeById(anyInt())).thenReturn(Optional.empty());

        var actual = mvc.perform(get("/resumes/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void createResume() throws Exception {
        when(svc.persistNewResume(any())).thenReturn(Optional.of(new Resume()));

        var actual = mvc.perform(post("/resumes").contentType(MediaType.APPLICATION_JSON).content("{}")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.CREATED.value());
    }

    @Test
    void createResumeNotStudent() throws Exception {
        when(svc.persistNewResume(any())).thenReturn(Optional.empty());

        var actual = mvc.perform(post("/resumes")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }
}
