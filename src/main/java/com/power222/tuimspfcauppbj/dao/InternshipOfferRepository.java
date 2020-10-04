package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {
        List<InternshipOffer> findByEmployerUsername(String username);
        List<InternshipOffer> findByAllowedStudentsContains(Student student);
        List<InternshipOffer> findAllByReviewStatePending();
}
