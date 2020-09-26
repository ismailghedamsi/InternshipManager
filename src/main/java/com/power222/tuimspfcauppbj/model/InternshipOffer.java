package com.power222.tuimspfcauppbj.model;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.io.File;
import java.sql.Blob;
import java.sql.Clob;
import java.util.Date;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
    @Lob
    private String joinedFile;

    public InternshipOffer(String title, String description, Employer employer, String companyName, int nbOfWeeks, double salary, int beginHour, int endHour, String companyLocation, Date creationDate, Date limitDateToApply, List<Student> allowedStudents, String joinedFile) {
        this.title = title;
        this.description = description;
        this.employer = employer;
        this.companyName = companyName;
        this.nbOfWeeks = nbOfWeeks;
        this.salary = salary;
        this.beginHour = beginHour;
        this.endHour = endHour;
        this.companyLocation = companyLocation;
        this.creationDate = creationDate;
        this.limitDateToApply = limitDateToApply;
        this.allowedStudents = allowedStudents;
        this.joinedFile = joinedFile;
    }
}
