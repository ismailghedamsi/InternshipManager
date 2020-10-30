package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.model.Contract;
import com.power222.tuimspfcauppbj.model.ContractDto;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.service.ContractService;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ContractGenerationServiceTest {
    @Mock
    private ContractService contractService;

    @Mock
    private StudentApplicationService studentApplicationService;

    @InjectMocks
    private ContractGenerationService contractGenerationService;

    private Contract contract;
    private StudentApplication exceptedStudentApplication;
    private ContractDto contractDto;
    private ContractDto nullContractDto;

    @BeforeEach
    void setUp() {
        contract = Contract.builder().adminName("Zack de la rocha")
                .engagementCollege("Engagement College")
                .engagementCompany("Engagement company")
                .engagementStudent("Engagement Etudiant")
                .file("tttt")
                .id(1)
                .totalHoursPerWeek(20)
                .build();
        exceptedStudentApplication = StudentApplication.builder().build();
        //contractDto = ContractDto.fromContract(contract, studentApplicationService);
        nullContractDto = null;
    }

    @Test
    public void successfulPdfGeneration() {

    }

    @Test
    public void getStudentApplicationWithWrongDto() {
        Optional<StudentApplication> optionalStudentApplication = contractGenerationService.getStudentApplication(null);
        System.out.println(optionalStudentApplication.isPresent());
        //assertThat(optionalStudentApplication).contains(expectedContract);

    }

}
