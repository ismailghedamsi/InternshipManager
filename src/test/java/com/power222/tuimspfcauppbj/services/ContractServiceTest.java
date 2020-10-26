package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.ContractRepository;
import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.service.ContractService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContractServiceTest {

    @Mock
    private ContractRepository contractRepo;

    @Mock
    private AuthenticationService authSvc;

    @InjectMocks
    private ContractService contractSvc;

    private User expectedUser;
    private Contract expectedContract;

    @BeforeEach
    void setUp() {
        expectedUser = User.builder()
                .id(1L)
                .role("admin")
                .build();

        StudentApplication expectedStudentApplication = StudentApplication.builder()
                .id(1L)
                .build();

        expectedContract = Contract.builder()
                .id(1L)
                .studentApplication(expectedStudentApplication)
                .build();
    }

    @Test
    void createAndSaveNewContractTest() {
        when(contractRepo.saveAndFlush(expectedContract)).thenReturn(expectedContract);
        var actual = contractSvc.createAndSaveNewContract(expectedContract);
        assertThat(actual).isNotNull();
        assertThat(actual).isNotEmpty();
        assertThat(actual).isEqualTo(actual);
    }

    @Test
    void getAllContractTest() {
        var i1 = Contract.builder().id(1L).build();
        var i2 = Contract.builder().id(2L).build();
        var i3 = Contract.builder().id(3L).build();

        when(contractRepo.findAll()).thenReturn(Arrays.asList(i1, i2, i3));

        var actual = contractSvc.getAllContract();

        assertThat(actual).hasSize(3);
    }

    @Test
    void getContractIdTest() {
        when(contractRepo.findById(1L)).thenReturn(Optional.of(expectedContract));

        var actual = contractSvc.getContractById(1L);

        assertThat(actual).contains(expectedContract);
    }

    @Test
    void getContractWithNoneExistentIdTest() {
        when(contractRepo.findById(1L)).thenReturn(Optional.empty());

        var actual = contractSvc.getContractById(1L);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateInterviewTest() {
        var initialId = expectedContract.getId();
        var alteredId = 123L;
        var alteredInterview = expectedContract.toBuilder().id(alteredId).build();
        when(contractRepo.findById(initialId)).thenReturn(Optional.of(expectedContract));
        when(contractRepo.saveAndFlush(alteredInterview)).thenReturn(expectedContract);

        var actual = contractSvc.updateContract(initialId, alteredInterview);

        assertThat(actual).isEqualTo(expectedContract);
    }

    @Test
    void updateContracWithNonexistentIdTest() {
        var actual = contractSvc.updateContract(100, expectedContract);

        assertThat(actual).isNotNull();
    }

    @Test
    void deleteInterviewByIdTest() {
        var idToDelete = expectedContract.getId();

        contractSvc.deleteContractById(idToDelete);

        verify(contractRepo, times(1)).deleteById(idToDelete);
    }

}
