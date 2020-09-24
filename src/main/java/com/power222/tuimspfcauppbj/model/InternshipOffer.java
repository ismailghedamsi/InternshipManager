package com.power222.tuimspfcauppbj.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Blob;
import java.util.Date;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class InternshipOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "internship_offer_id")
    private long internshipOfferId;
    private String title;
    private String description;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;
    private String companyName;
    private int nbOfWeeks;
    private double salary;
    private int beginHour;
    private int endHour;
    private String companyLocation;
    private Date creationDate;
    private Date limitDateToApply;
    @ManyToMany
    private List<Student> allowedStudents;
    private Blob pdfByteRepresentation;
}
