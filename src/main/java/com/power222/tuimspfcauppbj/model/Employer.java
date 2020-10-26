package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@Entity
public class Employer extends User {

    private String companyName;
    private String contactName;
    private String phoneNumber;
    private String address;
    private String email;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
    @JsonIgnore
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<InternshipOffer> offers;

    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
    @JsonIgnore
    @Filter(name = "semesterFilter", condition = "semester = :semester")
    private List<Interview> interviews;
}
