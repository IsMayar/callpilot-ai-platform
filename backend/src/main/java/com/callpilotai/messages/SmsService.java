package com.callpilotai.messages;

import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public SmsDeliveryResult send(String body) {
        return new SmsDeliveryResult(MessageStatus.SENT, Instant.now());
    }
}

