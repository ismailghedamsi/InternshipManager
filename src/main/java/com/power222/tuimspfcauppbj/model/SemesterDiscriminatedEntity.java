package com.power222.tuimspfcauppbj.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.persistence.MappedSuperclass;

@Data
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
@FilterDef(name = "semesterFilter", parameters = {@ParamDef(name = "semester", type = "string")})
@Filter(name = "semesterFilter", condition = "semester = :semester")
public abstract class SemesterDiscriminatedEntity {

    private String semester;
}
