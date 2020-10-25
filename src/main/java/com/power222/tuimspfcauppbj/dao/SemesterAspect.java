package com.power222.tuimspfcauppbj.dao;

import com.power222.tuimspfcauppbj.model.SemesterDiscriminatedEntity;
import com.power222.tuimspfcauppbj.util.SemesterContext;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

//        org.hibernate.Filter filter = jpaRepository.entityManager.unwrap(Session.class).enableFilter("semesterFilter");
//        filter.setParameter("semester", SemesterContext.getCurrent());
//        filter.validate();

@Aspect
@Component
public class SemesterAspect {

    @Before("execution(* org.springframework.data.jpa.repository.JpaRepository+.save*(..))")
    public void beforeSaves(JoinPoint jp) {
        var o = jp.getArgs()[0];
        if (o instanceof SemesterDiscriminatedEntity) {
            var entity = (SemesterDiscriminatedEntity) o;
            if (entity.getSemester() == null || entity.getSemester().isBlank())
                entity.setSemester(SemesterContext.isSet() ? SemesterContext.getCurrent() : SemesterContext.getPresentSemester());
        }
    }

    //todo: filtering of nested entities
    @Around(value = "execution(* org.springframework.data.jpa.repository.JpaRepository+.find*(..))")
    public Object afterFind(ProceedingJoinPoint jp) throws Throwable {
        var o = jp.proceed();
        if (o instanceof Optional) {
            final var opt = (Optional) o;
            if (opt.isPresent() && opt.get() instanceof SemesterDiscriminatedEntity) {
                var entity = (SemesterDiscriminatedEntity) opt.get();
                return entity.getSemester().equals(SemesterContext.getCurrent()) ? Optional.of(entity) : Optional.empty();
            }
        } else if (o instanceof List) {
            final var list = (List) o;
            if (!list.isEmpty() && list.get(0) instanceof SemesterDiscriminatedEntity) {
                final var discriminatedList = (List<SemesterDiscriminatedEntity>) list;
                return discriminatedList.stream()
                        .filter(entity -> entity.getSemester().equals(SemesterContext.getCurrent()))
                        .collect(Collectors.toList());
            }
        }

        return o;
    }
}
