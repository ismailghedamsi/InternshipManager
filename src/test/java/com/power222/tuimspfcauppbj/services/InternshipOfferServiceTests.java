package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.service.InternshipOfferService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

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
    private String pdfContent;

    @BeforeEach
    void setUp() {

        pdfContent = "yvDquEQNiEAAAAABJRU5ErkJggg==";
        expectedOffer = InternshipOffer.builder().allowedStudents(new ArrayList<>())
                .beginHour(8).endHour(16).companyLocation("Montreal").companyName("Dacima").creationDate(new Date(2020,8,8))
                .description("description").employer(new Employer()).joinedFile(pdfContent).limitDateToApply(new Date(2020,11,10))
                .nbOfWeeks(8).salary(20).title("Title").build();


        }

    @Test
    void uploadInternshipOffer() {
        when(service.uploadInternshipOffer(expectedOffer,pdfContent).get()).thenReturn(expectedOffer);
        Optional<InternshipOffer> createdOffer = service.uploadInternshipOffer(expectedOffer,pdfContent);
        assertThat(createdOffer).isEqualTo(expectedOffer);
    }


}