package com.power222.tuimspfcauppbj.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
public class Student extends User {

    private String firstName;
    private String lastName;
    private String studentId;
    private String email;
    private String phoneNumber;
    private String address;
    @ManyToMany
    @JoinTable(
            name = "student_internship_offer_applications",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "internshipOfferId"))
    private List<InternshipOffer> appliedoffers;

}
