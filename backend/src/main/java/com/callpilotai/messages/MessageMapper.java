package com.callpilotai.messages;

import com.callpilotai.messages.dto.MessageResponse;
import java.util.Optional;

final class MessageMapper {

    private MessageMapper() {
    }

    static MessageResponse toResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getBusiness().getId(),
                Optional.ofNullable(message.getCustomer()).map(customer -> customer.getId()).orElse(null),
                Optional.ofNullable(message.getLead()).map(lead -> lead.getId()).orElse(null),
                message.getDirection(),
                message.getChannel(),
                message.getBody(),
                message.getStatus(),
                message.getSentAt(),
                message.getCreatedAt());
    }
}

