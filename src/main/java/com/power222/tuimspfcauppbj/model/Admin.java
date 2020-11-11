package com.power222.tuimspfcauppbj.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.Entity;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Entity
public class Admin extends User {
    private String name;
}
