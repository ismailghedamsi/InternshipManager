package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.User;
import com.power222.tuimspfcauppbj.service.AuthenticationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authSvc;

    public AuthenticationController(AuthenticationService authSvc) {
        this.authSvc = authSvc;
    }

    @GetMapping("/user")
    public User getCurrentUser() {
        return authSvc.getCurrentUser();
    }


}
