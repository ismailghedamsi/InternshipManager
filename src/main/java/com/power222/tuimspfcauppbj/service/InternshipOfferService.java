package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.InternshipOfferRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class InternshipOfferService {

    private final InternshipOfferRepository internshipOfferRepository;
    private final AuthenticationService authenticationService;

    public InternshipOfferService(InternshipOfferRepository internshipOfferRepository,
        AuthenticationService authenticationService) {
        this.internshipOfferRepository = internshipOfferRepository;
        this.authenticationService = authenticationService;
    }

    public Optional<InternshipOffer> uploadInternshipOffer(InternshipOffer offer) {
        Employer employer = offerUploader();
        if (employer == null) {
            return Optional.empty();
        }
        employer.getOffers().add(offer);
        offer.setEmployer(employer);
        return Optional.of(internshipOfferRepository.saveAndFlush(offer));
    }

    private Employer offerUploader() {
        Employer employer = null;
        if (authenticationService.getCurrentUser() instanceof Employer) {
            employer = (Employer) authenticationService.getCurrentUser();
        }
        return employer;
    }

    public List<InternshipOffer> getAllInternshipOffers() {
        return internshipOfferRepository.findAll();
    }

    public Optional<InternshipOffer> getInternshipOfferById(long id) {
        return internshipOfferRepository.findById(id);
    }

    public List<InternshipOffer> getInternshipOffersOfEmployer(String username){
        return internshipOfferRepository.findByEmployerUsername(username);
    }

    public InternshipOffer updateInternshipOffer(long id, InternshipOffer offer) {
        return internshipOfferRepository.findById(id)
                .map(oldOffer -> {
                    offer.setId(oldOffer.getId());
                    return internshipOfferRepository.saveAndFlush(offer);
                })
                .orElse(offer);
    }

    public void deleteOfferById(long id) {
        internshipOfferRepository.deleteById(id);
    }
}
