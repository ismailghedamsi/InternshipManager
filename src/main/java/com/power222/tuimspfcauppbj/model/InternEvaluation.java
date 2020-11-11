package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.util.Appreciation;
import com.power222.tuimspfcauppbj.util.Opinion;
import com.power222.tuimspfcauppbj.util.SimpleResponse;
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

    private Opinion productivityA;
    private Opinion productivityB;
    private Opinion productivityC;
    private Opinion productivityD;
    private Opinion productivityE;
    private String productivityComment;

    private Opinion jobQualityA;
    private Opinion jobQualityB;
    private Opinion jobQualityC;
    private Opinion jobQualityD;
    private Opinion jobQualityE;
    private String jobQualityComment;

    private Opinion interpersonalRelationsA;
    private Opinion interpersonalRelationsB;
    private Opinion interpersonalRelationsC;
    private Opinion interpersonalRelationsD;
    private Opinion interpersonalRelationsE;
    private Opinion interpersonalRelationsF;
    private String interpersonalComment;

    private Opinion personalSkillsA;
    private Opinion personalSkillsB;
    private Opinion personalSkillsC;
    private Opinion personalSkillsD;
    private Opinion personalSkillsE;
    private Opinion personalSkillsF;
    private String personalSkillsComment;

    private Appreciation globalAppreciation;
    private String globalAppreciationComment;
    private boolean discussedWithIntern;
    private float nbHourSupervisionPerWeek;

    private SimpleResponse hireInternAgainPossibility;
    private String techincalFormationOpinion;
    private String signature;
    private LocalDate evaluationDate;
    private String reviewerName;
    private String reviewerFunction;

    @OneToOne
    private Contract contract;
}
