package com.callpilotai.team;

import com.callpilotai.team.dto.TeamMemberRequest;
import com.callpilotai.team.dto.TeamMemberResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Validated
@RestController
@RequestMapping("/team")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    public TeamMemberController(TeamMemberService teamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    @GetMapping
    public Page<TeamMemberResponse> getTeamMembers(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable,
            Authentication authentication) {
        return teamMemberService.getTeamMembers(ownerSubject(authentication), pageable);
    }

    @PostMapping
    public ResponseEntity<TeamMemberResponse> createTeamMember(
            @Valid @RequestBody TeamMemberRequest request,
            Authentication authentication) {
        TeamMemberResponse response = teamMemberService.createTeamMember(ownerSubject(authentication), request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public TeamMemberResponse updateTeamMember(
            @PathVariable UUID id,
            @Valid @RequestBody TeamMemberRequest request,
            Authentication authentication) {
        return teamMemberService.updateTeamMember(id, ownerSubject(authentication), request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable UUID id, Authentication authentication) {
        teamMemberService.deleteTeamMember(id, ownerSubject(authentication));
        return ResponseEntity.noContent().build();
    }

    private String ownerSubject(Authentication authentication) {
        return authentication.getName();
    }
}
