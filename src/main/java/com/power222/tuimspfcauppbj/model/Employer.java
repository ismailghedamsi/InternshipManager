package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
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
    @OneToMany(mappedBy = "employer",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnoreProperties("employer")
    private List<InternshipOffer> offers;


}
