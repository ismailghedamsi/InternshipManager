package com.power222.tuimspfcauppbj.controllers;


import com.power222.tuimspfcauppbj.controller.EmployerController;
import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@WebMvcTest(EmployerController.class)
public class EmployerControllerTests {

    //Pour que Spring ne plante pas au CommandLineRunner
    @MockBean
    private UserRepository userRepository;

    @MockBean
    private StudentRepository studentRepository;

    @MockBean
    private EmployerRepository empRepo;

    @Autowired
    private MockMvc mvc;

    @Test
    @WithMockUser("employer")
    void getEmployer() throws Exception {
        Employer emp = Employer.builder()
                .enabled(true)
                .id(1L)
                .username("employer")
                .role("employer")
                .companyName("AL")
                .contactName("emp1")
                .phoneNumber("0123456789")
                .address("123claurendeau")
                .email("123@claurendeau.qc.ca")
                .build();

        when(empRepo.findById(1L)).thenReturn(Optional.ofNullable(emp));

        mvc.perform(get("/employers/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.enabled").value("true"))
                .andExpect(jsonPath("$.role").value("employer"))
                .andExpect(jsonPath("$.username").value("employer"))
                .andExpect(jsonPath("$.companyName").value("AL"))
                .andExpect(jsonPath("$.contactName").value("emp1"))
                .andExpect(jsonPath("$.phoneNumber").value("0123456789"))
                .andExpect(jsonPath("$.address").value("123claurendeau"))
                .andExpect(jsonPath("$.email").value("123@claurendeau.qc.ca"));
    }

    //@Test
    void createEmployer() throws Exception {
        Employer emp = Employer.builder()
                .enabled(true)
                .id(1L)
                .username("employer")
                .role("employer")
                .companyName("AL")
                .contactName("emp1")
                .phoneNumber("0123456789")
                .address("123claurendeau")
                .email("123@claurendeau.qc.ca")
                .build();

        when(empRepo.saveAndFlush(any())).thenReturn(emp);

        mvc.perform(post("/employers").contentType(MediaType.APPLICATION_JSON).content("{\"id\":1,\"username\":\"employer\",\"role\":\"employer\",\"enabled\":true,\"companyName\":\"AL\",\"contactName\":\"emp1\",\"phoneNumber\":\"0123456789\",\"address\":\"123claurendeau\",\"email\":\"123@claurendeau.qc.ca\"}"))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.enabled").value("true"))
                .andExpect(jsonPath("$.role").value("employer"))
                .andExpect(jsonPath("$.username").value("employer"))
                .andExpect(jsonPath("$.companyName").value("AL"))
                .andExpect(jsonPath("$.contactName").value("emp1"))
                .andExpect(jsonPath("$.phoneNumber").value("0123456789"))
                .andExpect(jsonPath("$.address").value("123claurendeau"))
                .andExpect(jsonPath("$.email").value("123@claurendeau.qc.ca"));

    }
}
