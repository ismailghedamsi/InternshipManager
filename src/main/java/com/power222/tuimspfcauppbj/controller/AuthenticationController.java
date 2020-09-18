package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authSvc;

    @GetMapping("/basic")
    public String authenticate() {
        return "{ message: \"Login successful\" }";
    }

    @GetMapping("/user")
    public User getCurrentUser() {
        return authSvc.getCurrentUser();
    }


}
