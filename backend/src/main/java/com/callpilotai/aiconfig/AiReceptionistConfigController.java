package com.callpilotai.aiconfig;

import com.callpilotai.aiconfig.dto.AiReceptionistConfigRequest;
import com.callpilotai.aiconfig.dto.AiReceptionistConfigResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/ai-config")
public class AiReceptionistConfigController {

    private final AiReceptionistConfigService aiReceptionistConfigService;

    public AiReceptionistConfigController(AiReceptionistConfigService aiReceptionistConfigService) {
        this.aiReceptionistConfigService = aiReceptionistConfigService;
    }

    @GetMapping
    public AiReceptionistConfigResponse getConfig(Authentication authentication) {
        return aiReceptionistConfigService.getConfig(ownerSubject(authentication));
    }

    @PutMapping
    public AiReceptionistConfigResponse updateConfig(
            @Valid @RequestBody AiReceptionistConfigRequest request,
            Authentication authentication) {
        return aiReceptionistConfigService.updateConfig(ownerSubject(authentication), request);
    }

    private String ownerSubject(Authentication authentication) {
        return authentication.getName();
    }
}
