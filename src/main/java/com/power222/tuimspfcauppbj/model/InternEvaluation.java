package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.util.AccepteStudentAgain;
import com.power222.tuimspfcauppbj.util.AppreciationStates;
import com.power222.tuimspfcauppbj.util.StatesEvaluation;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

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

    private long studentApplicationId;

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

    private StatesEvaluation interpersonalRelationsA;
    private StatesEvaluation interpersonalRelationsB;
    private StatesEvaluation interpersonalRelationsC;
    private StatesEvaluation interpersonalRelationsD;
    private StatesEvaluation interpersonalRelationsE;
    private StatesEvaluation interpersonalRelationsF;
    private String interpersonalCommentary;

    private StatesEvaluation personalSkillsA;
    private StatesEvaluation personalSkillsB;
    private StatesEvaluation personalSkillsC;
    private StatesEvaluation personalSkillsD;
    private StatesEvaluation personalSkillsE;
    private StatesEvaluation personalSkillsF;
    private String personalSkillsCommentary;

    private AppreciationStates globalAppreciation;
    private String globalAppreciationCommentary;
    private boolean discussedWithIntern;
    private float nbHourSupervisionPerWeek;

    private AccepteStudentAgain hireInternAgainPossibility;
    private String techincalFormationOpinion;
    private String signature;
    private LocalDate evaluationDate;
    private String reviewerName;
    private String reviewerFunction;

    @OneToOne()
    private Contract contract;
}
