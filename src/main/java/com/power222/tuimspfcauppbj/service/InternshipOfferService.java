package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.nio.file.Files;
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
        Employer employer = null;
        if(authenticationService.getCurrentUser() instanceof Employer){
            employer =(Employer) authenticationService.getCurrentUser();
        }

        if(employer == null){
            return  Optional.empty();
        }
        employer.getOffers().add(offer);
            offer.setEmployer(employer);
            offer.setJoinedFile(pdfContent);
        return Optional.of(internshipOfferRepository.saveAndFlush(offer));

    }



}
