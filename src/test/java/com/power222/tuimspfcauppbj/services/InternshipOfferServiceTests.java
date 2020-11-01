package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.service.InternshipOfferService;
import com.power222.tuimspfcauppbj.util.ReviewState;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class InternshipOfferServiceTests {
    @Mock
    private InternshipOfferRepository offerRepository;

    @Mock
    private StudentRepository studentRepo;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private InternshipOfferService service;
    private InternshipOffer expectedOffer;
    private InternshipOffer expectedOffer2;
    private List<InternshipOffer> expectedOffers;
    private List<InternshipOffer> expectedOffersOfEmployer;
    private Employer expectedEmployer;
    private Student expectedStudent;

    @BeforeEach
    void setUp() {
        Employer employer = Employer.builder().username("mark").email("a@gmail.com").build();
        String pdfContent = "yvDquEQNiEAAAAABJRU5ErkJggg==";
        try {
            expectedOffer = InternshipOffer.builder().id(1L).allowedStudents(new ArrayList<>())
                    .creationDate(new SimpleDateFormat("dd/MM/yyyy").parse("08/08/2020"))
                    .description("description").employer(employer).file(pdfContent)
                    .limitDateToApply(new SimpleDateFormat("dd/MM/yyyy").parse("31/08/2020"))
                    .internshipStartDate(new SimpleDateFormat("dd/MM/yyyy").parse("01/11/2020"))
                    .internshipStartDate(new SimpleDateFormat("dd/MM/yyyy").parse("01/04/2021"))
                    .salary(20)
                    .title("Title")
                    .reviewState(ReviewState.PENDING)
                    .startTime(8)
                    .endTime(16)
                    .build();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        try {
            expectedOffer2 = InternshipOffer.builder().id(2).allowedStudents(new ArrayList<>())
                    .creationDate(new SimpleDateFormat("dd/MM/yyyy").parse("08/08/2020"))
                    .description("description").employer(new Employer()).file(pdfContent)
                    .limitDateToApply(new SimpleDateFormat("dd/MM/yyyy").parse("31/08/2020"))
                    .internshipStartDate(new SimpleDateFormat("dd/MM/yyyy").parse("01/01/2021"))
                    .internshipStartDate(new SimpleDateFormat("dd/MM/yyyy").parse("01/05/2021"))
                    .salary(20)
                    .title("Title")
                    .reviewState(ReviewState.PENDING)
                    .startTime(8)
                    .endTime(16)
                    .build();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        expectedOffers = new ArrayList<>();
        expectedOffers.add(expectedOffer);
        expectedOffers.add(expectedOffer2);

        expectedOffersOfEmployer = new ArrayList<>();
        expectedOffersOfEmployer.add(expectedOffer);

        expectedEmployer = Employer.builder()
                .username("employeur")
                .role("employer")
                .offers(new ArrayList<>())
                .build();

        expectedStudent = Student.builder()
                .id(1L)
                .username("student")
                .password("password")
                .role("student")
                .firstName("Simon")
                .lastName("Longpré")
                .studentId("1386195")
                .email("simon@cal.qc.ca")
                .phoneNumber("5144816959")
                .address("6600 St-Jacques Ouest")
                .build();
    }

    @Test
    void successfulInternshipOfferUpload() {
        when(authenticationService.getCurrentUser()).thenReturn(expectedEmployer);
        when(offerRepository.saveAndFlush(expectedOffer)).thenReturn(expectedOffer);
        expectedOffer.setEmployer(null);
        Optional<InternshipOffer> createdOffer = service.uploadInternshipOffer(expectedOffer);
        assertThat(createdOffer).contains(expectedOffer);
    }

    @Test
    void tryToUploadOfferForNonexistentUser() {
        when(authenticationService.getCurrentUser()).thenReturn(null);

        Optional<InternshipOffer> createdOffer = service.uploadInternshipOffer(expectedOffer);

        assertThat(createdOffer).isEmpty();
    }

    @Test
    void getAllInternshipOffersReturnsListOffer() {
        when(offerRepository.findAll()).thenReturn(expectedOffers);

        List<InternshipOffer> createdOffers = service.getAllInternshipOffers();

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void getAllInternshipOffersByStudentID() {
        when(offerRepository.findAllByAllowedStudentsId(expectedStudent.getId())).thenReturn(expectedOffers);

        List<InternshipOffer> createdOffers = service.getOfferByAllowedStudentId(expectedStudent.getId());

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void getAllInternshipOffersWithPendingApproval() {
        when(offerRepository.findAllByReviewStatePending()).thenReturn(expectedOffers);

        List<InternshipOffer> createdOffers = service.getInternshipOffersWithPendingApproval();

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void getAllApprovedInternshipOffers() {
        when(offerRepository.findAllByReviewStateApproved()).thenReturn(expectedOffers);

        List<InternshipOffer> createdOffers = service.getApprovedInternshipOffers();

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers).contains(expectedOffer, expectedOffer2);
    }

    @Test
    void OfferFoundById() {
        when(offerRepository.findById(1L)).thenReturn(Optional.of(expectedOffer));
        var actual = service.getInternshipOfferById(1L);
        assertThat(actual).contains(expectedOffer);
    }

    @Test
    void OfferNotFoundById() {
        when(offerRepository.findById(5L)).thenReturn(Optional.empty());
        var actual = service.getInternshipOfferById(5L);
        assertThat(actual).isEmpty();

    }

    @Test
    void deleteResumeById() {
        var idToDelete = expectedOffer.getId();

        service.deleteOfferById(idToDelete);

        verify(offerRepository, times(1)).deleteById(idToDelete);
    }

    @Test
    void getInternshipOffersOfEmployer() {
        when(offerRepository.findByEmployerUsername("a@gmail.com")).thenReturn(expectedOffersOfEmployer);
        List<InternshipOffer> offers = service.getInternshipOffersOfEmployer("a@gmail.com");
        assertThat(expectedOffersOfEmployer.size()).isEqualTo(offers.size());
        assertThat(offers.get(0)).isEqualTo(expectedOffersOfEmployer.get(0));
    }

    @Test
    void updateOffer() {
        var initialId = expectedOffer.getId();
        var alteredId = 100L;
        var alteredResume = expectedOffer.toBuilder().id(alteredId).build();
        when(offerRepository.findById(initialId)).thenReturn(Optional.ofNullable(expectedOffer));
        when(offerRepository.saveAndFlush(expectedOffer)).thenReturn(expectedOffer);

        var actual = service.updateInternshipOffer(initialId, alteredResume);

        assertThat(actual).contains(expectedOffer);
    }

    @Test
    void addStudentToOffer() {
        expectedOffer2 = expectedOffer.toBuilder().build();
        expectedOffer2.setAllowedStudents(Collections.singletonList(expectedStudent));
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(studentRepo.findById(expectedStudent.getId())).thenReturn(Optional.of(expectedStudent));
        when(offerRepository.saveAndFlush(expectedOffer2)).thenReturn(expectedOffer2);

        var actual = service.addOrRemoveStudentFromOffer(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).contains(expectedOffer2);
    }

    @Test
    void removeStudentFromOffer() {
        expectedOffer.getAllowedStudents().add(expectedStudent);
        expectedOffer2 = expectedOffer.toBuilder().build();
        expectedOffer2.setAllowedStudents(Collections.emptyList());
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(studentRepo.findById(expectedStudent.getId())).thenReturn(Optional.of(expectedStudent));
        when(offerRepository.saveAndFlush(expectedOffer2)).thenReturn(expectedOffer2);

        var actual = service.addOrRemoveStudentFromOffer(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).contains(expectedOffer2);
    }

    @Test
    void addInvalidStudentToOffer() {
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));
        when(studentRepo.findById(expectedStudent.getId())).thenReturn(Optional.empty());

        var actual = service.addOrRemoveStudentFromOffer(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void addStudentToInvalidOffer() {
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.empty());

        var actual = service.addOrRemoveStudentFromOffer(expectedOffer.getId(), expectedStudent.getId());

        assertThat(actual).isEmpty();
    }

    @Test
    void updateOfferWithNonexistentId() {
        var actual = service.updateInternshipOffer(expectedOffer.getId(), expectedOffer);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateOfferWithInvalidStateNullMessage() {
        var updatedOffer = expectedOffer.toBuilder().reviewState(ReviewState.DENIED).build();
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));

        var actual = service.updateInternshipOffer(expectedOffer.getId(), updatedOffer);

        assertThat(actual).isEmpty();
    }

    @Test
    void updateOfferWithInvalidStateBlankMessage() {
        var updatedOffer = expectedOffer.toBuilder()
                .reviewState(ReviewState.DENIED)
                .reasonForRejection(" ")
                .build();
        when(offerRepository.findById(expectedOffer.getId())).thenReturn(Optional.of(expectedOffer));

        var actual = service.updateInternshipOffer(expectedOffer.getId(), updatedOffer);

        assertThat(actual).isEmpty();
    }
}
