package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.power222.tuimspfcauppbj.util.InterviewState;
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
    private InterviewState studentAcceptanceState = InterviewState.INTERVIEW_WAITING_FOR_STUDENT_DECISION;
    private String reasonForRejectionByStudent;

    @ManyToOne(optional = false)
    @JsonIgnoreProperties("offers")
    private Employer employer;

    @OneToOne
    @JsonIgnoreProperties("interview")
    private StudentApplication studentApplication;
}
