package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.Employer;
import com.power222.tuimspfcauppbj.model.InternshipOffer;
import com.power222.tuimspfcauppbj.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {
        List<InternshipOffer>  findAllByEmployerUsername(String username);
        List<InternshipOffer>  findAllByAllowedStudents(Student student);
}
