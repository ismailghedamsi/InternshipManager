package com.power222.tuimspfcauppbj.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.power222.tuimspfcauppbj.util.InterviewState;
import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Interview extends SemesterDiscriminatedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private Date date;
    @Builder.Default
    private InterviewState studentAcceptanceState = InterviewState.INTERVIEW_WAITING_FOR_STUDENT_DECISION;
    private String reasonForRejectionByStudent;

    @OneToOne
    @JsonIgnoreProperties(value = "interview", allowSetters = true)
    private StudentApplication studentApplication;
}