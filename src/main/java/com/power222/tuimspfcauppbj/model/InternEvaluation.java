package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.util.StatesEvaluation;
import lombok.*;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class InternEvaluation extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String fullName;
    private String program;
    private String entrepriseName;
    private String supervisorName;
    private String fonction;
    private String phoneNumber;

    private StatesEvaluation productivityA;
    private StatesEvaluation productivityB;
    private StatesEvaluation productivityC;
    private StatesEvaluation productivityD;
    private StatesEvaluation productivityE;
    private String productivityCommentary;

    private StatesEvaluation jobQualityA;
    private StatesEvaluation jobQualityB;
    private StatesEvaluation jobQualityC;
    private StatesEvaluation jobQualityD;
    private StatesEvaluation jobQualityE;
    private String jobQualityCommentary;


    @OneToOne()
    private Contract contract;
}
