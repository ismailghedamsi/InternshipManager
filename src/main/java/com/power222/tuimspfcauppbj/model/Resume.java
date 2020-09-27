package com.power222.tuimspfcauppbj.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.io.File;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true)
@SuperBuilder
@EqualsAndHashCode
@Entity
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private File file;

    @ManyToOne
    private Student owner;
}
