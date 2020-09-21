package com.power222.tuimspfcauppbj.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.controller.StudentController;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Student;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import({TestsWithoutSecurityConfig.class})
@WebMvcTest(StudentController.class)
public class StudentControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentRepository studentRepository;

    private Student expected;

    @BeforeEach
    void beforeEach() {
        expected = Student.builder().enabled(true)
                .username("etudiant")
                .role("student")
                .password("password")
                .firstName("Bob")
                .lastName("Brutus")
                .id(4L)
                .studentId("1234")
                .email("power@gmail.ca")
                .phoneNumber("911")
                .address("9310 Lasalle")
                .build();
    }

    @Test
    void getStudentByIdTest() throws Exception {
        when(studentRepository.findById(4L)).thenReturn(java.util.Optional.ofNullable(expected));

        MvcResult result = mvc.perform(get("/students/4").contentType(MediaType.APPLICATION_JSON)).andReturn();

        Student actual = objectMapper.readValue(result.getResponse().getContentAsString(), Student.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(expected, actual);
    }

    @Test
    void createStudentTest() throws Exception {
        when(studentRepository.saveAndFlush(any())).thenReturn(expected);

        MvcResult result = mvc.perform(post("/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expected))).andReturn();

        Student actual = objectMapper.readValue(result.getResponse().getContentAsString(), Student.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.CREATED.value());
        assertEquals(expected, actual);
    }

    @Test
    void getAllEmployers() throws Exception {
        final int nbStudent = 3;

        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < nbStudent; i++)
            studentList.add(new Student());

        when(studentRepository.findAll()).thenReturn(studentList);

        MvcResult result = mvc.perform(get("/students")).andReturn();
        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbStudent);
    }
}
