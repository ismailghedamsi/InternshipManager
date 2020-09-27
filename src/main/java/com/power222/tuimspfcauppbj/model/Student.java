package com.power222.tuimspfcauppbj.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Set;

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

    @OneToMany
    private Set<Resume> resumes;
}
