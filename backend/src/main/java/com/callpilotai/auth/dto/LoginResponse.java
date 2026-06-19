package com.callpilotai.auth.dto;

public record LoginResponse(
        String accessToken,
        AuthenticatedUserResponse user) {
}

