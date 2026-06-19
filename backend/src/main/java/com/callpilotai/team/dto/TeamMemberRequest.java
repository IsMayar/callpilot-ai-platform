package com.callpilotai.team.dto;

import com.callpilotai.team.TeamMemberRole;
import com.callpilotai.team.TeamMemberStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TeamMemberRequest(
        @Size(max = 160, message = "User ID must be 160 characters or fewer.")
        String userId,

        @NotBlank(message = "Full name is required.")
        @Size(max = 160, message = "Full name must be 160 characters or fewer.")
        String fullName,

        @NotBlank(message = "Email is required.")
        @Email(message = "Email must be valid.")
        @Size(max = 160, message = "Email must be 160 characters or fewer.")
        String email,

        @NotNull(message = "Role is required.")
        TeamMemberRole role,

        @NotNull(message = "Status is required.")
        TeamMemberStatus status) {
}
