package com.callpilotai.business;

import com.callpilotai.business.dto.BusinessRequest;
import com.callpilotai.business.dto.BusinessResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
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
@RequestMapping("/businesses")
public class BusinessController {

    private final BusinessService businessService;

    public BusinessController(BusinessService businessService) {
        this.businessService = businessService;
    }

    @PostMapping
    public ResponseEntity<BusinessResponse> createBusiness(
            @Valid @RequestBody BusinessRequest request,
            Authentication authentication) {
        BusinessResponse response = businessService.createBusiness(ownerSubject(authentication), request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @GetMapping("/current")
    public BusinessResponse getCurrentBusiness(Authentication authentication) {
        return businessService.getCurrentBusiness(ownerSubject(authentication));
    }

    @PutMapping("/{id}")
    public BusinessResponse updateBusiness(
            @PathVariable UUID id,
            @Valid @RequestBody BusinessRequest request,
            Authentication authentication) {
        return businessService.updateBusiness(id, ownerSubject(authentication), request);
    }

    private String ownerSubject(Authentication authentication) {
        return authentication.getName();
    }
}

