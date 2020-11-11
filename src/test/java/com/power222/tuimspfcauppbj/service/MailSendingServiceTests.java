package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.model.StudentApplication;
import com.power222.tuimspfcauppbj.util.StudentApplicationState;
import com.power222.tuimspfcauppbj.util.UserTypes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
public class MailSendingServiceTests {

    @Mock
    JavaMailSender mailSender;

    @InjectMocks
    private MailSendingService service;

    StudentApplication expectedStudentApplication;
    StudentApplication failStudentApplication;
    InternshipOffer offerWithInvalidUser;
    InternshipOffer offer;
    Employer employer;

    @BeforeEach
    public void setUp() {
        employer = Employer.builder()
                .username("employeur")
                .password("Projet_employeur1")
                .companyName("Dacima")
                .contactName("Zack")
                .phoneNumber("5144317713")
                .address("1300 rue ducas")
                .email("projetemployeur@gmail.com")
                .build();

        offer = InternshipOffer.builder()
                .employer(employer)
                .title("Building music selling app with Blazor")
                .build();

        expectedStudentApplication = StudentApplication.builder()
                .id(1L)
                .offer(offer)
                .student(
                        Student.builder()
                                .firstName("Ismail")
                                .lastName("ghedamsi")
                                .email("projetemployeur@gmail.com")
                                .build())
                .state(StudentApplicationState.APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW)
                .reasonForRejection("")
                .build();

        offerWithInvalidUser = InternshipOffer.builder()
                .employer(Employer.builder().email("").build())
                .title("Building music selling app with Blazor")
                .build();

        failStudentApplication = StudentApplication.builder()
                .student(Student.builder().firstName("Ismail").lastName("ghedamsi").build())
                .offer(offerWithInvalidUser)
                .build();
    }
}
