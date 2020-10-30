package com.power222.tuimspfcauppbj.services;

import com.itextpdf.io.font.constants.StandardFonts;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.service.ContractService;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import com.power222.tuimspfcauppbj.util.ContractDto;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ContractGenerationServiceTest {
    @Mock
    private ContractService contractService;

    @Mock
    private StudentApplicationService studentApplicationService;

    @InjectMocks
    private ContractGenerationService contractGenerationService;

    private ContractDto contractDto;
    private ContractDto emptyContractDto;
    private StudentApplication exceptedStudentApplication;
    private boolean generatePdfSuccess = true;

    private

    @BeforeEach
    void setUp() {
        contractDto = ContractDto.builder().adminName("Zack de la rocha")
                .engagementCollege("Engagement College")
                .engagementCompany("Engagement company")
                .engagementStudent("Engagement Etudiant")
                .studentApplicationId(1L)
                .file("tttt")
                .totalHoursPerWeek(20)
                .build();

        emptyContractDto = ContractDto.builder().build();

        Employer employer = Employer.builder()
                .companyName("dacima")
                .build();
        InternshipOffer offer = null;
        try {
            offer = InternshipOffer.builder()
                    .employer(employer)
                    .description("The coolest internship")
                    .startTime(8)
                    .endTime(16)
                    .internshipEndDate(new SimpleDateFormat("dd/MM/yyyy").parse("01/11/2020"))
                    .internshipStartDate(new SimpleDateFormat("dd/MM/yyyy").parse("2/11/2020"))
                    .build();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Student student = Student.builder()
                .firstName("ismail")
                .lastName("ghedamsi")
                .build();
        exceptedStudentApplication = StudentApplication.builder()
                .id(1L)
                .offer(offer)
                .student(student)
                .build();
        //contractDto = ContractDto.fromContract(contract, studentApplicationService);
        //nullContractDto = null;
    }

    @Test
    public void base64ToPdfFileTest() {
        //ContractDto contractDto,String filePathName, String fileBase64
        String pathName = "test2.pdf";
        assertThat(contractGenerationService.base64ToPdfFile(pathName, contractDto.getFile())).isTrue();

    }

    @Test
    public void successfulPdfGenerationTest() {
        when(contractGenerationService.getStudentApplication(contractDto)).thenReturn(Optional.of(exceptedStudentApplication));
        when(studentApplicationService.getApplicationById(contractDto.getStudentApplicationId())).thenReturn(Optional.ofNullable(exceptedStudentApplication));
        generatePdfSuccess = contractGenerationService.generateContract(contractDto);
        assertThat(generatePdfSuccess).isTrue();
    }

    @Test
    public void getStudentApplicationWithWrongDtoTest() {
        lenient().when(contractGenerationService.getStudentApplication(emptyContractDto)).thenReturn(Optional.empty());
        //lenient().when(studentApplicationService.getApplicationById(emptyContractDto.getStudentApplicationId())).thenReturn(Optional.empty());
        generatePdfSuccess = contractGenerationService.generateContract(contractDto);
        assertThat(generatePdfSuccess).isFalse();
    }

    @Test
    public void undoBoldFailTest() {
        Assertions.assertThrows(com.itextpdf.io.IOException.class, () -> {
            contractGenerationService.undoBold("imaginaryFont");
        });
    }

    @Test
    public void undoBoldFailSucceedTest() {
        assertThat(contractGenerationService.undoBold(StandardFonts.TIMES_ROMAN)).isNotNull();
    }

}
