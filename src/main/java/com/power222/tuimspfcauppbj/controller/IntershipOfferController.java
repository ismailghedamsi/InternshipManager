package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.service.InternshipOfferService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offers")
public class IntershipOfferController {
    private  InternshipOfferService offerService;

    public IntershipOfferController(InternshipOfferService offerService) {
        this.offerService = offerService;
    }

    @GetMapping
    public List<InternshipOffer> getAllOffers() {
        return offerService.getAllInternshipOffers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipOffer> getOffer(@PathVariable long id) {
        return offerService.getInternshipOfferById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<InternshipOffer> createOffer(@RequestBody InternshipOffer newOffer) {
        return offerService.uploadInternshipOffer(newOffer)
                .map(offer -> ResponseEntity.status(HttpStatus.ACCEPTED.CREATED).body(offer))
                .orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @PutMapping("/update/{id}")
    public InternshipOffer updateOffer(@RequestBody InternshipOffer offer, @PathVariable long id) {
        return offerService.updateInternshipOffer(id, offer);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteOffer(@PathVariable long id) {
        offerService.deleteOfferById(id);
    }

}
