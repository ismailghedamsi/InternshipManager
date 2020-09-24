package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student newStudent) {
        newStudent.setRole("student");
        newStudent.setEnabled(true);
        newStudent.setPassword(passwordEncoder.encode(newStudent.getPassword()));
        return userRepo.findByUsername(newStudent.getUsername())
                .map(student -> ResponseEntity.status(HttpStatus.CONFLICT).<Student>build())
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CREATED).body(studentRepo.saveAndFlush(newStudent)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable long id) {
        return studentRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@RequestBody Student newStudent, @PathVariable long id) {
        Optional<Student> optStudent = studentRepo.findById(id).map(oldStudent -> {
            newStudent.setId(oldStudent.getId());
            return studentRepo.saveAndFlush(newStudent);
        });
        return ResponseEntity.of(optStudent);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteStudent(@PathVariable long id) {
        studentRepo.deleteById(id);
    }


}


