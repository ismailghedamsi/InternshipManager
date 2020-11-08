package com.power222.tuimspfcauppbj.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.model.InternEvaluation;
import com.power222.tuimspfcauppbj.service.InternEvaluationService;
import org.junit.jupiter.api.BeforeEach;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import({TestsWithoutSecurityConfig.class})
@WebMvcTest(InternEvaluationController.class)
public class InternEvaluationControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InternEvaluationService svc;

    private InternEvaluation expectedInternEvaluation;

    @BeforeEach
    void beforeEach() {
        expectedInternEvaluation = InternEvaluation.builder()
                .id(1L)
                .phoneNumber("12345")
                .build();
    }

    @Test
    void createInternEvaluationTest() throws Exception {
        when(svc.createAndSaveNewInternEvaluation(expectedInternEvaluation)).thenReturn(expectedInternEvaluation);

        MvcResult result = mvc.perform(post("/api/internEvaluation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedInternEvaluation))).andReturn();

        var actual = objectMapper.readValue(result.getResponse().getContentAsString(), InternEvaluation.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(expectedInternEvaluation, actual);
    }

    @Test
    void createInternEvaluationEmptyTest() throws Exception {
        when(svc.createAndSaveNewInternEvaluation(expectedInternEvaluation)).thenReturn(null);

        MvcResult result = mvc.perform(post("/api/internEvaluation")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
    }
}
