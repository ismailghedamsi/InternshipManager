package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.power222.tuimspfcauppbj.util.SemesterAware;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
public class Employer extends User implements SemesterAware {

    private String companyName;
    private String contactName;
    private String phoneNumber;
    private String address;
    private String email;

    @ElementCollection
    private List<String> semesters;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
    @JsonIgnore
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<InternshipOffer> offers;

    @OneToMany(cascade = CascadeType.ALL)
    @JsonIgnore
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<Interview> interviews;
}
