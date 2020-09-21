package com.power222.tuimspfcauppbj.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.controller.EmployerController;
import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.model.Employer;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import({TestsWithoutSecurityConfig.class})
@WebMvcTest(EmployerController.class)
public class EmployerControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployerRepository empRepo;

    private Employer expected;

    @BeforeEach
    private void beforeEach() {
        expected = Employer.builder()
                .enabled(true)
                .id(1L)
                .username("employer")
                .password("password")
                .role("employer")
                .companyName("AL")
                .contactName("emp1")
                .phoneNumber("0123456789")
                .address("123claurendeau")
                .email("123@claurendeau.qc.ca")
                .build();
    }

    @Test
    void getEmployerTest() throws Exception {
        when(empRepo.findById(1L)).thenReturn(Optional.ofNullable(expected));

        MvcResult result = mvc.perform(get("/employers/1").contentType(MediaType.APPLICATION_JSON)).andReturn();

        Employer actual = objectMapper.readValue(result.getResponse().getContentAsString(), Employer.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(expected, actual);
    }

    @Test
    void createEmployerTest() throws Exception {
        when(empRepo.saveAndFlush(any())).thenReturn(expected);

        MvcResult result = mvc.perform(post("/employers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expected))).andReturn();

        Employer actual = objectMapper.readValue(result.getResponse().getContentAsString(), Employer.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.CREATED.value());
        assertEquals(expected, actual);
    }

    @Test
    void getAllEmployers() throws Exception {
        final int nbEmployer = 3;

        List<Employer> employerList = new ArrayList<>();
        for (int i = 0; i < nbEmployer; i++)
            employerList.add(new Employer());

        when(empRepo.findAll()).thenReturn(employerList);

        MvcResult result = mvc.perform(get("/employers")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbEmployer);
    }
}
