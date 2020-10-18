package com.power222.tuimspfcauppbj.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.controller.InterviewController;
import com.power222.tuimspfcauppbj.model.Interview;
import com.power222.tuimspfcauppbj.service.InterviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import(TestsWithoutSecurityConfig.class)
@WebMvcTest(InterviewController.class)
class InterviewControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InterviewService svc;

    @Test
    void getInterviewFound() throws Exception {
        when(svc.getInterviewById(anyLong())).thenReturn(Optional.of(new Interview()));

        var actual = mvc.perform(get("/api/interviews/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void getInterviewNotFound() throws Exception {
        when(svc.getInterviewById(anyInt())).thenReturn(Optional.empty());

        var actual = mvc.perform(get("/api/interviews/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void getAllInterviews() throws Exception {
        final int nbInterviews = 3;

        List<Interview> list = new ArrayList<>();
        for (int i = 0; i < nbInterviews; i++)
            list.add(new Interview());

        when(svc.getAllInterviews()).thenReturn(list);

        MvcResult result = mvc.perform(get("/api/interviews")).andReturn();

        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbInterviews);
    }

    @Test
    void createInterview() throws Exception {
        when(svc.persistNewInterview(any())).thenReturn(Optional.of(new Interview()));

        var actual = mvc.perform(post("/api/interviews").contentType(MediaType.APPLICATION_JSON).content("{}")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.CREATED.value());
    }

    @Test
    void updateInterviewTest() throws Exception {
        var expectedInterview = Interview.builder().build();

        when(svc.updateInterview(expectedInterview.getId(), expectedInterview)).thenReturn(Optional.of(expectedInterview));

        MvcResult result = mvc.perform(put("/api/interviews/" + expectedInterview.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedInterview))).andReturn();


        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).updateInterview(expectedInterview.getId(), expectedInterview);
    }
}
