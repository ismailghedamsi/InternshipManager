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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

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
    }

}
