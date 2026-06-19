package com.callpilotai.team;

import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import com.callpilotai.team.dto.TeamMemberRequest;
import com.callpilotai.team.dto.TeamMemberResponse;
import com.callpilotai.team.exception.TeamMemberAlreadyExistsException;
import com.callpilotai.team.exception.TeamMemberNotFoundException;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamMemberService {

    private final BusinessRepository businessRepository;
    private final TeamMemberRepository teamMemberRepository;

    public TeamMemberService(
            BusinessRepository businessRepository,
            TeamMemberRepository teamMemberRepository) {
        this.businessRepository = businessRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Transactional(readOnly = true)
    public Page<TeamMemberResponse> getTeamMembers(String ownerSubject, Pageable pageable) {
        Business business = currentBusiness(ownerSubject);

        return teamMemberRepository.findByBusinessId(business.getId(), pageable)
                .map(TeamMemberMapper::toResponse);
    }

    @Transactional
    public TeamMemberResponse createTeamMember(String ownerSubject, TeamMemberRequest request) {
        Business business = currentBusiness(ownerSubject);
        NormalizedTeamMember normalized = normalize(request);
        assertEmailAvailable(business.getId(), normalized.email(), null);
        TeamMember teamMember = new TeamMember(
                business,
                normalized.userId(),
                normalized.fullName(),
                normalized.email(),
                normalized.role(),
                normalized.status());

        return TeamMemberMapper.toResponse(teamMemberRepository.save(teamMember));
    }

    @Transactional
    public TeamMemberResponse updateTeamMember(UUID id, String ownerSubject, TeamMemberRequest request) {
        Business business = currentBusiness(ownerSubject);
        TeamMember teamMember = teamMemberRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(TeamMemberNotFoundException::new);
        NormalizedTeamMember normalized = normalize(request);
        assertEmailAvailable(business.getId(), normalized.email(), id);

        teamMember.update(
                normalized.userId(),
                normalized.fullName(),
                normalized.email(),
                normalized.role(),
                normalized.status());

        return TeamMemberMapper.toResponse(teamMember);
    }

    @Transactional
    public void deleteTeamMember(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        TeamMember teamMember = teamMemberRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(TeamMemberNotFoundException::new);

        teamMemberRepository.delete(teamMember);
    }

    private Business currentBusiness(String ownerSubject) {
        return businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
    }

    private void assertEmailAvailable(UUID businessId, String email, UUID currentTeamMemberId) {
        teamMemberRepository.findByBusinessIdAndEmailIgnoreCase(businessId, email)
                .filter(existing -> !existing.getId().equals(currentTeamMemberId))
                .ifPresent(existing -> {
                    throw new TeamMemberAlreadyExistsException(email);
                });
    }

    private NormalizedTeamMember normalize(TeamMemberRequest request) {
        return new NormalizedTeamMember(
                normalizeNullable(request.userId()),
                request.fullName().trim(),
                request.email().trim().toLowerCase(),
                request.role(),
                request.status());
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private record NormalizedTeamMember(
            String userId,
            String fullName,
            String email,
            TeamMemberRole role,
            TeamMemberStatus status) {
    }
}
