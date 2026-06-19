package com.callpilotai.auth;

import com.callpilotai.auth.dto.AuthenticatedUserResponse;
import com.callpilotai.auth.dto.LoginRequest;
import com.callpilotai.auth.dto.LoginResponse;
import com.callpilotai.config.properties.DemoAuthProperties;
import com.callpilotai.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DemoAuthService {

    private final DemoAuthProperties demoAuthProperties;
    private final JwtService jwtService;

    public DemoAuthService(DemoAuthProperties demoAuthProperties, JwtService jwtService) {
        this.demoAuthProperties = demoAuthProperties;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        if (!demoAuthProperties.email().equalsIgnoreCase(request.email().trim())
                || !demoAuthProperties.password().equals(request.password())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        AuthenticatedUserResponse user = demoUser();
        String accessToken = jwtService.generateAccessToken(
                user.email(),
                Map.of(
                        "userId", user.id(),
                        "email", user.email(),
                        "name", user.name()));

        return new LoginResponse(accessToken, user);
    }

    public AuthenticatedUserResponse currentUser(String subject) {
        if (!demoAuthProperties.email().equalsIgnoreCase(subject)) {
            throw new UsernameNotFoundException("Authenticated user was not found.");
        }

        return demoUser();
    }

    private AuthenticatedUserResponse demoUser() {
        String email = demoAuthProperties.email().toLowerCase();

        return new AuthenticatedUserResponse(
                UUID.nameUUIDFromBytes(email.getBytes(StandardCharsets.UTF_8)).toString(),
                demoAuthProperties.email(),
                demoAuthProperties.name());
    }
}

