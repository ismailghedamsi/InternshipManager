package com.power222.tuimspfcauppbj.model;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
public class Interview {
    @Id
    private long id;

    private Date date;
    private long time;
    private boolean hasStudentAccepted;

    @OneToOne
    private StudentApplication studentApplication;
}
