package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.SemesterDiscriminatedEntity;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Aspect
@Component
public class SemesterAspect {

    @PersistenceContext
    EntityManager entityManager;

    @Before("execution(* org.springframework.data.repository.Repository+.*(..))")
    public void activateTenantFilter() {
        String semester = SemesterContext.isSet() ? SemesterContext.getCurrent() : SemesterContext.getPresentSemester();
        Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("semesterFilter");
        filter.setParameter("semester", semester);
    }


    @Before("execution(* org.springframework.data.repository.Repository+.save*(..))")
    public void beforeSaves(JoinPoint jp) {
        var o = jp.getArgs()[0];
        if (o instanceof SemesterDiscriminatedEntity) {
            var entity = (SemesterDiscriminatedEntity) o;
            if (entity.getSemester() == null || entity.getSemester().isBlank())
                entity.setSemester(SemesterContext.isSet() ? SemesterContext.getCurrent() : SemesterContext.getPresentSemester());
        }
    }
}
