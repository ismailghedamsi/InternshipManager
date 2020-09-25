package com.power222.tuimspfcauppbj.service;

import com.power222.tuimspfcauppbj.dao.StudentRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Student;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepo, UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.studentRepo = studentRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> getAllStudents() {
        return null;
    }

    public Optional<Student> getStudentById(long id) {
        return null;
    }

    public boolean persistNewStudent(Student student) {
        return false;
    }

    public Student updateStudent(long id, Student student) {
        return null;
    }

    public void deleteStudentById(long id) {

    }
}
