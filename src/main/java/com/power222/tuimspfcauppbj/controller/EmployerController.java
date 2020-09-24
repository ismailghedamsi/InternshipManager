package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.dao.UserRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/employers")
public class EmployerController {

    @Autowired
    private EmployerRepository employerRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Employer> getAllEmployers() {
        return employerRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<Employer> createEmployer(@RequestBody Employer newEmployer) {
        newEmployer.setRole("employer");
        newEmployer.setEnabled(true);
        newEmployer.setPassword(passwordEncoder.encode(newEmployer.getPassword()));
        return userRepo.findByUsername(newEmployer.getUsername())
                .map(employer -> ResponseEntity.status(HttpStatus.CONFLICT).<Employer>build())
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CREATED).body(employerRepo.saveAndFlush(newEmployer)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employer> getEmployerById(@PathVariable long id) {
        return employerRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employer> updateEmployer(@RequestBody Employer newEmployer, @PathVariable long id) {
        Optional<Employer> optEmployer = employerRepo.findById(id).map(oldEmployer -> {
            newEmployer.setId(oldEmployer.getId());
            return employerRepo.saveAndFlush(newEmployer);
        });
        return ResponseEntity.of(optEmployer);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteEmployer(@PathVariable long id) {
        employerRepo.deleteById(id);
    }
}
