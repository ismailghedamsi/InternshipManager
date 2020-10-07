package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.InternshipOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {
    List<InternshipOffer> findByEmployerUsername(String username);

    List<InternshipOffer> findAllByAllowedStudentsId(long id);

    List<InternshipOffer> findAllByReviewState(InternshipOffer.ReviewState reviewState);

    default List<InternshipOffer> findAllByReviewStatePending() {
        return findAllByReviewState(InternshipOffer.ReviewState.PENDING);
    }

    default List<InternshipOffer> findAllByReviewStateApproved() {
        return findAllByReviewState(InternshipOffer.ReviewState.APPROVED);
    }
}
