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

    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository) {
        this.internshipOfferRepository = internshipOfferRepository;
    }

    public Optional<InternshipOffer> uploadPdf(InternshipOffer offer,String pdfContent,String username){
        Optional<Employer> optionalEmployer = employerRepository.findByUsername(username);
        Employer employer;
        Optional<InternshipOffer> nullableOffer = Optional.empty();
        if(optionalEmployer.isPresent()){
            employer = optionalEmployer.get();
            employer.getOffers().add(offer);
            offer.setJoinedFile(pdfContent);
            employerRepository.save(employer);
            nullableOffer = Optional.of(offer);
        }

        return nullableOffer;

    }

    public InternshipOffer downloadPdf(){
        return null;
    }

}
