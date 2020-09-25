package com.power222.tuimspfcauppbj.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.Entity;

@Data
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Entity
public class Student extends User {

    private String firstName;
    private String lastName;
    private String studentId;
    private String email;
    private String phoneNumber;
    private String address;

}
