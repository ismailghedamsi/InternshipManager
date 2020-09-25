package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Student;
import com.power222.tuimspfcauppbj.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService svc;

    public StudentController(StudentService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return svc.getAllStudents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable long id) {
        return svc.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student newStudent) {
        var status = svc.persistNewStudent(newStudent) ? HttpStatus.CREATED : HttpStatus.CONFLICT;
        return ResponseEntity.status(status).build();
    }

    @PutMapping("/{id}")
    public Student updateStudent(@RequestBody Student student, @PathVariable long id) {
        return svc.updateStudent(id, student);

        /*Optional<Student> optStudent = studentRepo.findById(id).map(oldStudent -> {
            newStudent.setId(oldStudent.getId());
            return studentRepo.saveAndFlush(newStudent);
        });
        return ResponseEntity.of(optStudent);*/
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteStudent(@PathVariable long id) {
        svc.deleteStudentById(id);
    }


}


