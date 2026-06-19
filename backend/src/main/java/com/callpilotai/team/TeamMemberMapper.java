package com.callpilotai.team;

import com.callpilotai.team.dto.TeamMemberResponse;

final class TeamMemberMapper {

    private TeamMemberMapper() {
    }

    static TeamMemberResponse toResponse(TeamMember teamMember) {
        return new TeamMemberResponse(
                teamMember.getId(),
                teamMember.getBusiness().getId(),
                teamMember.getUserId(),
                teamMember.getFullName(),
                teamMember.getEmail(),
                teamMember.getRole(),
                teamMember.getStatus(),
                teamMember.getCreatedAt(),
                teamMember.getUpdatedAt());
    }
}
