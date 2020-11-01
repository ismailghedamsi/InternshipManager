package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.service.ContractGenerationService;
import com.power222.tuimspfcauppbj.service.ContractService;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import com.power222.tuimspfcauppbj.util.ContractDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ContractGenerationServiceTest {

    @Mock
    private ContractService contractService;

    @Mock
    private StudentApplicationService studentApplicationService;

    @Mock
    private MimeMessageHelper mimeMessageHelper;

    @InjectMocks
    private ContractGenerationService contractGenerationService;

    private ContractDto contractDto;
    private StudentApplication expectedStudentApplication;

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
            fail("Le format de date est invalide");
        }
        Student student = Student.builder()
                .firstName("ismail")
                .lastName("ghedamsi")
                .build();
        expectedStudentApplication = StudentApplication.builder()
                .id(1L)
                .offer(offer)
                .student(student)
                .build();
    }

    @Test
    public void successfulPdfGenerationTest() {
        when(contractGenerationService.getStudentApplication(contractDto)).thenReturn(Optional.of(expectedStudentApplication));
        when(studentApplicationService.getApplicationById(contractDto.getStudentApplicationId())).thenReturn(Optional.ofNullable(expectedStudentApplication));
        boolean generatePdfSuccess = contractGenerationService.generateContract(contractDto);
        assertThat(generatePdfSuccess).isTrue();
    }

    @Test
    public void getStudentApplicationWithWrongDtoTest() {
        boolean generatePdfSuccess = contractGenerationService.generateContract(contractDto);
        assertThat(generatePdfSuccess).isFalse();
    }
}
