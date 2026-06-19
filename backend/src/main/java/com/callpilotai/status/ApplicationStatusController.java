package com.callpilotai.status;

import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApplicationStatusController {

    @GetMapping("/status")
    public ApplicationStatusResponse status() {
        return new ApplicationStatusResponse("ok", "callpilot-ai", Instant.now());
    }
}
