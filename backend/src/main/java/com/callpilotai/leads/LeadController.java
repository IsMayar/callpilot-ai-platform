package com.callpilotai.leads;

import com.callpilotai.leads.dto.LeadRequest;
import com.callpilotai.leads.dto.LeadResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Validated
@RestController
@RequestMapping("/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public Page<LeadResponse> getLeads(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LeadStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            Authentication authentication) {
        return leadService.getLeads(ownerSubject(authentication), search, status, pageable);
    }

    @GetMapping("/{id}")
    public LeadResponse getLead(@PathVariable UUID id, Authentication authentication) {
        return leadService.getLead(id, ownerSubject(authentication));
    }

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(
            @Valid @RequestBody LeadRequest request,
            Authentication authentication) {
        LeadResponse response = leadService.createLead(ownerSubject(authentication), request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public LeadResponse updateLead(
            @PathVariable UUID id,
            @Valid @RequestBody LeadRequest request,
            Authentication authentication) {
        return leadService.updateLead(id, ownerSubject(authentication), request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable UUID id, Authentication authentication) {
        leadService.deleteLead(id, ownerSubject(authentication));
        return ResponseEntity.noContent().build();
    }

    private String ownerSubject(Authentication authentication) {
        return authentication.getName();
    }
}

