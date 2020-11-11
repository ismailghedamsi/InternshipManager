package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.util.Opinion;
import com.power222.tuimspfcauppbj.util.SimpleResponse;
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

    private GeneralInfo infos;
    private ProductivityCriterias productivity;
    private WorkQualityCriterias quality;
    private InterpersonalRelationsCriterias relationships;
    private PersonalSkills skills;
    private GlobalAppreciation appreciation;
    private Feedback feedback;
    private Signature signature;

    @OneToOne
    private Contract contract;

    @Data
    @Embeddable
    public static class ProductivityCriterias {
        private Opinion efficiency;
        private Opinion comprehension;
        private Opinion rythm;
        private Opinion priorities;
        private Opinion deadlines;
        private String comment;
    }

    @Data
    @Embeddable
    public static class WorkQualityCriterias {
        private Opinion followsInstructions;
        private Opinion detailsAttention;
        private Opinion doubleChecks;
        private Opinion striveForPerfection;
        private Opinion problemAnalysis;
        private String comment;

    }

    @Data
    @Embeddable
    public static class InterpersonalRelationsCriterias {
        private Opinion connectsEasily;
        private Opinion teamworkContribution;
        private Opinion culturalAdaptation;
        private Opinion acceptsCriticism;
        private Opinion respectsOthers;
        private Opinion activelyListens;
        private String comment;
    }

    @Data
    @Embeddable
    public static class PersonalSkills {
        private Opinion showsInterest;
        private Opinion expressesOwnIdeas;
        private Opinion showsInitiative;
        private Opinion worksSafely;
        private Opinion dependable;
        private Opinion punctual;
        private String comment;
    }

    @Data
    @Embeddable
    public static class GlobalAppreciation {
        private Expectations expectations;
        private String comment;
        private boolean discussedWithIntern;
    }

    @Data
    @Embeddable
    public static class GeneralInfo {
        private String studentProgram;
        private String supervisorRole;
        private String phoneNumber;
    }

    @Data
    @Embeddable
    public static class Feedback {
        private float weeklySupervisionHours;
        private SimpleResponse hireAgain;
        private String technicalFormationOpinion;
    }

    public enum Expectations {
        GREATLY_EXCEEDED,
        EXCEEDED,
        MET,
        PARTIALLY_MET,
        NOT_MET
    }
}
