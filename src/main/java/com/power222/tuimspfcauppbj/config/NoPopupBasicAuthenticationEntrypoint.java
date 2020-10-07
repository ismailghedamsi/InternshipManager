package com.power222.tuimspfcauppbj.config;

import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class NoPopupBasicAuthenticationEntrypoint implements AuthenticationEntryPoint {

    private boolean expiredRaised = false;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {

        if (exception instanceof CredentialsExpiredException) {
            response.sendError(498, exception.getMessage());
        } else if (!expiredRaised) {
            response.sendError(401, exception.getMessage());
        }

        expiredRaised = exception instanceof CredentialsExpiredException;
    }
}
