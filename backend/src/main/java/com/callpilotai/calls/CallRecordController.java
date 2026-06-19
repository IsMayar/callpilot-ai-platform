package com.callpilotai.calls;

import com.callpilotai.calls.dto.CallRecordRequest;
import com.callpilotai.calls.dto.CallRecordResponse;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Validated
@RestController
@RequestMapping("/calls")
public class CallRecordController {

    private final CallRecordService callRecordService;

    public CallRecordController(CallRecordService callRecordService) {
        this.callRecordService = callRecordService;
    }

    @GetMapping
    public Page<CallRecordResponse> getCallRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CallStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            Authentication authentication) {
        return callRecordService.getCallRecords(ownerSubject(authentication), search, status, pageable);
    }

    @GetMapping("/{id}")
    public CallRecordResponse getCallRecord(@PathVariable UUID id, Authentication authentication) {
        return callRecordService.getCallRecord(id, ownerSubject(authentication));
    }

    @PostMapping
    public ResponseEntity<CallRecordResponse> createCallRecord(
            @Valid @RequestBody CallRecordRequest request,
            Authentication authentication) {
        CallRecordResponse response = callRecordService.createCallRecord(ownerSubject(authentication), request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    private String ownerSubject(Authentication authentication) {
        return authentication.getName();
    }
}

