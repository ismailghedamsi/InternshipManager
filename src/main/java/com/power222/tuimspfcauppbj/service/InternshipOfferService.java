package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InternshipOfferService {

    private InternshipOfferRepository internshipOfferRepository;
    private EmployerRepository employerRepository;
    private AuthenticationService authenticationService;

    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository, EmployerRepository employerRepository, AuthenticationService authenticationService) {
        this.internshipOfferRepository = internshipOfferRepository;
        this.employerRepository = employerRepository;
        this.authenticationService = authenticationService;
    }

    public Optional<InternshipOffer> uploadInternshipOffer(InternshipOffer offer, String pdfContent){
        Employer employer = OfferUploader();

        if(employer == null){
            return  Optional.empty();
        }
        employer.getOffers().add(offer);
            offer.setEmployer(employer);
            offer.setJoinedFile(pdfContent);
        return Optional.of(internshipOfferRepository.saveAndFlush(offer));

    }

    private Employer OfferUploader() {
        Employer employer = new Employer();
        if(authenticationService.getCurrentUser() instanceof Employer){
            employer =(Employer) authenticationService.getCurrentUser();
        }
        return employer;
    }

    public List<InternshipOffer> downloadInternshipOffers(InternshipOffer offer, String pdfContent){
        Employer employer = OfferUploader();
        List<InternshipOffer> offers = new ArrayList<>();
        return null;
    };



}
