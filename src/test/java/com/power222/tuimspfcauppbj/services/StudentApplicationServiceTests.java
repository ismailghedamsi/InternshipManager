package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.ResumeRepository;
import com.power222.tuimspfcauppbj.dao.StudentApplicationRepository;
import com.power222.tuimspfcauppbj.model.*;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.service.StudentApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentApplicationServiceTests {

    @Mock
    private StudentApplicationRepository appliRepo;

    @Mock
    private InternshipOfferRepository offerRepo;

    @Mock
    private ResumeRepository resumeRepo;

    @Mock
    private AuthenticationService authSvc;

    @InjectMocks
    private StudentApplicationService appliSvc;

    private Student expectedUser;
    private InternshipOffer expectedOffer;
    private Resume expectedResume;
    private StudentApplication expectedAppli;

    @BeforeEach
    void beforeEach() {
        expectedUser = Student.builder()
                .id(1L)
                .build();

        expectedOffer = InternshipOffer.builder()
                .id(1L)
                .build();

        expectedResume = Resume.builder()
                .id(1L)
                .build();

        expectedAppli = StudentApplication.builder()
                .isHired(false)
                .offer(expectedOffer)
                .student(expectedUser)
                .resume(expectedResume)
                .build();
    }

    @Test
    void createAndSaveNewApplication() {
        when(authSvc.getCurrentUser()).thenReturn(expectedUser);
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));
        when(appliRepo.saveAndFlush(expectedAppli)).thenReturn(expectedAppli);

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).contains(expectedAppli);
    }

    @Test
    void createAndSaveNewApplicationWithNonStudentUser() {
        when(authSvc.getCurrentUser()).thenReturn(new Employer());
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void createAndSaveNewApplicationWithInvalidOfferId() {
        when(authSvc.getCurrentUser()).thenReturn(new Employer());
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.empty());
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void createAndSaveNewApplicationWithInvalidResumeId() {
        when(authSvc.getCurrentUser()).thenReturn(new Employer());
        when(offerRepo.findById(expectedOffer.getId())).thenReturn(Optional.empty());
        when(resumeRepo.findById(expectedResume.getId())).thenReturn(Optional.of(expectedResume));

        var actual = appliSvc.createAndSaveNewApplication(expectedOffer.getId(), expectedResume.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void updateStudentApplicationIsHired() {
        when(appliRepo.findById(expectedAppli.getId())).thenReturn(Optional.of(expectedAppli));
        when(appliRepo.saveAndFlush(expectedAppli)).thenReturn(expectedAppli);

        var actual = appliSvc.updateStudentApplicationIsHired(expectedAppli.getId());
        assertThat(actual).isNotEmpty();
        assertThat(actual).contains(expectedAppli);
    }

    @Test
    void updateStudentApplicationIsHiredWithNoneExistentId() {
        when(appliRepo.findById(expectedAppli.getId())).thenReturn(Optional.empty());
        var actual = appliSvc.updateStudentApplicationIsHired(expectedAppli.getId());
        assertThat(actual).isEmpty();
    }
}