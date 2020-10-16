package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder(toBuilder = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Resume {
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
