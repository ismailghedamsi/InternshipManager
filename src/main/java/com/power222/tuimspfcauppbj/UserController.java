package com.power222.tuimspfcauppbj;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, world!";
    }

    @GetMapping("/hello/private")
    public String helloPrivate() {
        return "Hello, private world!";
    }
}
