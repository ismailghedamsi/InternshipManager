package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.service.InternshipOfferService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
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
    private EmployerRepository employerRepository;
    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private InternshipOfferService service;



    private InternshipOffer expectedOffer;
    private InternshipOffer expectedOffer2;
    private List<InternshipOffer> expectedOffers;
    private List<InternshipOffer> expectedOffersOfEmployer;
    private Employer expectedEmployer;
    private String pdfContent;


    @BeforeEach
    void setUp() {
        Employer employer = Employer.builder().username("mark").email("a@gmail.com").build();
        pdfContent = "yvDquEQNiEAAAAABJRU5ErkJggg==";
        expectedOffer = InternshipOffer.builder().id(1L).allowedStudents(new ArrayList<>())
                .beginHour(8).endHour(16).companyLocation("Montreal").companyName("Dacima").creationDate(new Date(2020,8,8))
                .description("description").employer(employer).joinedFile(pdfContent).limitDateToApply(new Date(2020,11,10))
                .nbOfWeeks(8).salary(20).title("Title").build();

        expectedOffer2 = InternshipOffer.builder().id(2).allowedStudents(new ArrayList<>())
                .beginHour(8).endHour(16).companyLocation("Japon").companyName("SquareEnix").creationDate(new Date(2020,8,8))
                .description("description").employer(new Employer()).joinedFile(pdfContent).limitDateToApply(new Date(2020,11,10))
                .nbOfWeeks(8).salary(20).title("Title").build();

        expectedOffers = new ArrayList<>();
        expectedOffers.add(expectedOffer);
        expectedOffers.add(expectedOffer2);

        expectedOffersOfEmployer = new ArrayList<>();
        expectedOffersOfEmployer.add(expectedOffer);

        expectedEmployer = Employer.builder()
                .enabled(true)
                .username("employeur")
                .role("employer")
                .offers(new ArrayList<>())
                .build();

        }

    @Test
    void succesfulInternshipOfferUpload() {
        when(authenticationService.getCurrentUser()).thenReturn(expectedEmployer);
        when(offerRepository.saveAndFlush(expectedOffer)).thenReturn(expectedOffer);

        Optional<InternshipOffer> createdOffer = service.uploadInternshipOffer(expectedOffer);

        assertThat(createdOffer).contains(expectedOffer);
    }

    @Test
    void tryToUploadOfferForUnexistantUser() {
        when(authenticationService.getCurrentUser()).thenReturn(null);

        Optional<InternshipOffer> createdOffer = service.uploadInternshipOffer(expectedOffer);

        assertThat(createdOffer).isEmpty();
    }

    @Test
    void getAllInternshipOffersReturnsListOffer() {
        when(offerRepository.findAll()).thenReturn(expectedOffers);

        List<InternshipOffer> createdOffers = service.getAllInternshipOffers();

        assertThat(createdOffers.size()).isEqualTo(2);
        assertThat(createdOffers.get(0)).isEqualTo(expectedOffer);
        assertThat(createdOffers.get(1)).isEqualTo(expectedOffer2);
    }

    @Test
    void OfferFoundById() {
        when(offerRepository.findById(1L)).thenReturn(Optional.of(expectedOffer));
        var actual = service.getInternshipOfferById(1L);
        assertThat(actual).isNotEmpty();

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
    void getInternshipOffersOfEmployer(){
        when(offerRepository.findByEmployerEmail("a@gmail.com")).thenReturn(expectedOffersOfEmployer);
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

        assertThat(actual).isEqualTo(expectedOffer);
    }

    @Test
    void updateResumeWithNonexistentId() {
        var actual = service.updateInternshipOffer(expectedOffer.getId(), expectedOffer);

        assertThat(actual).isEqualTo(expectedOffer);
    }



}