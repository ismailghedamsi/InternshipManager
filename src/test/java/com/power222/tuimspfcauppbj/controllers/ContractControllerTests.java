package com.power222.tuimspfcauppbj.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.controller.ContractController;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.ContractService;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import(TestsWithoutSecurityConfig.class)
@WebMvcTest(ContractController.class)
public class ContractControllerTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContractService svc;

    private Contract expectedContract;

    @BeforeEach
    void beforeEach() {
        expectedContract = Contract.builder()
                .id(1L)
                .adminName("Reda")
                .engagementCollege("College")
                .engagementCompany("Company")
                .engagementStudent("Student")
                .file("file")
                .totalHoursPerWeek(32)
                .studentApplication(new StudentApplication())
                .build();
    }

    @Test
    void getAllContractsTest() throws Exception {
        final int nbContract = 3;

        List<Contract> list = new ArrayList<>();
        for (int i = 0; i < nbContract; i++)
            list.add(new Contract());

        when(svc.getAllContract()).thenReturn(list);

        MvcResult result = mvc.perform(get("/api/contract")).andReturn();

        var actuals = objectMapper.readValue(result.getResponse().getContentAsString(), List.class);

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        assertEquals(actuals.size(), nbContract);
    }

    @Test
    void getContractFound() throws Exception {
        when(svc.getContractById(anyLong())).thenReturn(Optional.of(new Contract()));

        var actual = mvc.perform(get("/api/contract/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.OK.value());
    }

    @Test
    void getContractNotFound() throws Exception {
        when(svc.getContractById(anyInt())).thenReturn(Optional.empty());

        var actual = mvc.perform(get("/api/contract/5")).andReturn();

        assertThat(actual.getResponse().getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
    }

    @Test
    void updateContractTest() throws Exception {
        when(svc.updateContract(expectedContract.getId(), expectedContract)).thenReturn(Optional.ofNullable(expectedContract));

        MvcResult result = mvc.perform(put("/api/contract/" + expectedContract.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedContract)))
                .andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).updateContract(expectedContract.getId(), expectedContract);
    }

    @Test
    void updateContractNoValidIdTest() throws Exception {
        MvcResult result = mvc.perform(put("/api/contract/" + expectedContract.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(expectedContract)))
                .andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.NOT_FOUND.value());
    }

    @Test
    void updateContractSignatureStateTest() throws Exception {
        when(svc.updateContractSignatureState(expectedContract.getId(), true)).thenReturn(Optional.ofNullable(expectedContract));

        MvcResult result = mvc.perform(put("/api/contract/state/" + expectedContract.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(true)))
                .andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).updateContractSignatureState(expectedContract.getId(), true);
    }

    @Test
    void updateContractSignatureStateTestWithInvalidId() throws Exception {
        MvcResult result = mvc.perform(put("/api/contract/state/" + expectedContract.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(true)))
                .andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.NOT_FOUND.value());
        verify(svc, times(1)).updateContractSignatureState(expectedContract.getId(), true);
    }

    @Test
    void deleteContractTest() throws Exception {
        MvcResult result = mvc.perform(delete("/api/contract/1")).andReturn();

        assertEquals(result.getResponse().getStatus(), HttpStatus.OK.value());
        verify(svc, times(1)).deleteContractById(1);
    }
}
