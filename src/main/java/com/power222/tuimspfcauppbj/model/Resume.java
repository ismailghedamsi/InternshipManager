package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = "file")
@Entity
public class Resume extends SemesterDiscriminatedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Lob
    private String file;

    private String name;
    private boolean reviewed;
    private boolean approuved;
    private String reasonForRejection;

    @ManyToOne
    @JsonIgnoreProperties({"resumes", "allowedOffers", "applications"})
    private Student owner;

    @OneToMany(mappedBy = "resume")
    @JsonIgnoreProperties({"student", "offer", "file"})
    private List<StudentApplication> applications;
}
