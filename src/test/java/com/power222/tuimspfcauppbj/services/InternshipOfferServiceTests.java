package com.power222.tuimspfcauppbj.services;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.service.InternshipOfferService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;


@RunWith(MockitoJUnitRunner.class)
class InternshipOfferServiceTests {
    @Mock
    private InternshipOfferRepository offerRepository;

    @InjectMocks
    private InternshipOfferService service;

    private InternshipOffer offer;

    @BeforeEach
    void setUp() {
        offer = new InternshipOffer("Programmeur analyse pour conception systeme de recherche",
                "description", new Employer(),
                "Dacima",
                15, 20.5, 8, 18, "Montreal",
                new Date(), new Date(), new ArrayList<>() ,null);

        }


    @AfterEach
    void tearDown() {
        offer = null;
    }

    @Test
    void uploadPdf() {
        when(service.uploadPdf(offer,"","employeur")).thenReturn(java.util.Optional.of(offer));
        Optional<InternshipOffer> createdOffer = service.uploadPdf(offer,"","employeur");
        assertThat(createdOffer.get()).isEqualTo(offer);
    }

    @Test
    void downloadPdf() {
        when(service.downloadPdf()).thenReturn(offer);
        Optional<InternshipOffer> createdOffer = service.uploadPdf(offer,"","etudiant");
        assertThat(createdOffer).isEqualTo(offer);
    }
}