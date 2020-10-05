package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.InternshipOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {
    List<InternshipOffer> findByEmployerUsername(String username);

    List<InternshipOffer> findAllByAllowedStudentsId(long id);
}
