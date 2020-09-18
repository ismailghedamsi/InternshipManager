package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.dao.EmployerRepository;
import com.power222.tuimspfcauppbj.model.Employer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/employers")
public class EmployerController {

    @Autowired
    private EmployerRepository repository;

    @GetMapping
    public List<Employer> getAllEmployers() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Employer createEmployer(@RequestBody Employer newEmployer) {
        return repository.saveAndFlush(newEmployer);
    }

    @GetMapping("/{id}")
    public Employer getEmployerById(@PathVariable long id) {
        return repository.findById(id).get();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employer> updateEmployer(@RequestBody Employer newEmployer, @PathVariable long id) {
        Optional<Employer> optEmployer = repository.findById(id).map(oldEmployer -> {
            newEmployer.setId(oldEmployer.getId());
            return repository.saveAndFlush(newEmployer);
        });
        return ResponseEntity.of(optEmployer);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteEmployer(@PathVariable long id) {
        repository.deleteById(id);
    }
}
