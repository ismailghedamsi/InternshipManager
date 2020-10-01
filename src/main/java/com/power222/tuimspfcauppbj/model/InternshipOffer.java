package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;
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
@Builder(toBuilder = true)
@EqualsAndHashCode
public class InternshipOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String description;
    @ManyToOne( optional = false)
    @JoinColumn(name = "employer_id", nullable = false)
    @JsonIgnoreProperties("offers")
    private Employer employer;
    private int nbOfWeeks;
    private double salary;
    private int beginHour;
    private int endHour;
    private Date creationDate;
    private Date limitDateToApply;
    @ManyToMany
    @JsonIgnore
    private List<Student> allowedStudents;
    @Lob
    private String joinedFile;
}
