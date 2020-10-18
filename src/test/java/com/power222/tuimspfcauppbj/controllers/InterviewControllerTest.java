package com.power222.tuimspfcauppbj.controllers;

import com.power222.tuimspfcauppbj.config.TestsWithoutSecurityConfig;
import com.power222.tuimspfcauppbj.controller.InterviewController;
import com.power222.tuimspfcauppbj.controller.ResumeController;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles({"noSecurityTests", "noBootstrappingTests"})
@Import(TestsWithoutSecurityConfig.class)
@WebMvcTest(InterviewController.class)
class InterviewControllerTest {

    @Test
    void getAllInterviews() {
    }

    @Test
    void getResume() {
    }

    @Test
    void createResume() {
    }

    @Test
    void updateResume() {
    }
}
