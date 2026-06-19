package com.callpilotai.auth.dto;

public record AuthenticatedUserResponse(
        String id,
        String email,
        String name) {
}

