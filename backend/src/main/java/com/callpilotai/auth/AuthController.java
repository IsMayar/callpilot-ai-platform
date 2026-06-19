package com.callpilotai.auth;

import com.callpilotai.auth.dto.AuthenticatedUserResponse;
import com.callpilotai.auth.dto.LoginRequest;
import com.callpilotai.auth.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final DemoAuthService authService;

    public AuthController(DemoAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public AuthenticatedUserResponse currentUser(Authentication authentication) {
        return authService.currentUser(authentication.getName());
    }
}

