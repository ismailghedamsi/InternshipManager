package com.power222.tuimspfcauppbj.model;

import com.power222.tuimspfcauppbj.util.Internship;
import com.power222.tuimspfcauppbj.util.Opinion;
import com.power222.tuimspfcauppbj.util.SimpleNumbers;
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
public class BusinessEvaluation extends SemesterDiscriminatedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private BusinessInfos businessInfos;
    private InternInfos internInfos;
    private EvaluationCriterias evaluationCriterias;
    private Observations observations;

    @Lob
    private String signature;
    private LocalDate date;


    @OneToOne()
    private Contract contract;

    @Data
    @Embeddable
    public static class BusinessInfos {
        private String companyName;
        private String employerName;
        private String address;
        private String phone;
        private String city;
        private String fax;
        private String postalCode;
    }

    @Data
    @Embeddable
    public static class InternInfos {
        private String internName;
        private String internDate;
        private Internship intership;
    }

    @Data
    @Embeddable
    public static class EvaluationCriterias {
        private Opinion workAsAnnoncement;
        private Opinion easyIntigration;
        private Opinion sufficientTime;
        private float hoursOfWeekFirstMonth;
        private float hoursOfWeekSecondMonth;
        private float hoursOfWeekThirdMonth;
        private Opinion securityWorkPlace;
        private Opinion agreeableEnvironnement;
        private Opinion goodSalary;
        private float salary;
        private Opinion supervisorFacilitatesIntern;
        private Opinion adequateEquipement;
        private Opinion accetableWorkload;
        private String comment;
    }

    @Data
    @Embeddable
    public static class Observations {
        private Internship whichInternship;
        private SimpleNumbers numbersOfIntern;
        private SimpleResponse welcomeSameIntern;
        private SimpleResponse variablesQuarters;
        private String quartersOne;
        private String quartersTwo;
        private String quartersThree;
    }
}
