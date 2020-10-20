package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Date date;
    private ReviewState reviewState;
    private String reasonForRejection;

    @ManyToOne(optional = false)
    @JsonIgnoreProperties("offers")
    private Employer employer;

    @OneToOne
    private StudentApplication studentApplication;
}
