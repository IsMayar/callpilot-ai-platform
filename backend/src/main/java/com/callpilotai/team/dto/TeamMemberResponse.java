package com.callpilotai.team.dto;

import com.callpilotai.team.TeamMemberRole;
import com.callpilotai.team.TeamMemberStatus;
import java.time.Instant;
import java.util.UUID;

public record TeamMemberResponse(
        UUID id,
        UUID businessId,
        String userId,
        String fullName,
        String email,
        TeamMemberRole role,
        TeamMemberStatus status,
        Instant createdAt,
        Instant updatedAt) {
}
