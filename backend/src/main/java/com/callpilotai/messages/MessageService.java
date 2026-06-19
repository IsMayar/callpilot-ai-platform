package com.callpilotai.messages;

import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import com.callpilotai.customers.Customer;
import com.callpilotai.customers.CustomerRepository;
import com.callpilotai.customers.exception.CustomerNotFoundException;
import com.callpilotai.leads.Lead;
import com.callpilotai.leads.LeadRepository;
import com.callpilotai.leads.exception.LeadNotFoundException;
import com.callpilotai.messages.dto.MessageRequest;
import com.callpilotai.messages.dto.MessageResponse;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final MessageRepository messageRepository;
    private final SmsService smsService;

    public MessageService(
            BusinessRepository businessRepository,
            CustomerRepository customerRepository,
            LeadRepository leadRepository,
            MessageRepository messageRepository,
            SmsService smsService) {
        this.businessRepository = businessRepository;
        this.customerRepository = customerRepository;
        this.leadRepository = leadRepository;
        this.messageRepository = messageRepository;
        this.smsService = smsService;
    }

    @Transactional(readOnly = true)
    public Page<MessageResponse> getMessages(String ownerSubject, String search, Pageable pageable) {
        Business business = currentBusiness(ownerSubject);
        String normalizedSearch = normalizeNullable(search);
        Page<Message> messages = normalizedSearch == null
                ? messageRepository.findByBusinessId(business.getId(), pageable)
                : messageRepository.searchByBusinessId(business.getId(), normalizedSearch, pageable);

        return messages.map(MessageMapper::toResponse);
    }

    @Transactional
    public MessageResponse createMessage(String ownerSubject, MessageRequest request) {
        Business business = currentBusiness(ownerSubject);
        Customer customer = findCustomer(request.customerId(), business.getId());
        Lead lead = findLead(request.leadId(), business.getId());
        String body = request.body().trim();
        MessageDirection direction = request.direction();
        MessageChannel channel = request.channel();
        SmsDeliveryResult deliveryResult = direction == MessageDirection.OUTBOUND && channel == MessageChannel.SMS
                ? smsService.send(body)
                : new SmsDeliveryResult(MessageStatus.RECEIVED, Instant.now());

        Message message = new Message(
                business,
                customer,
                lead,
                direction,
                channel,
                body,
                deliveryResult.status(),
                deliveryResult.sentAt());

        return MessageMapper.toResponse(messageRepository.save(message));
    }

    private Business currentBusiness(String ownerSubject) {
        return businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
    }

    private Customer findCustomer(UUID customerId, UUID businessId) {
        if (customerId == null) {
            return null;
        }

        return customerRepository.findByIdAndBusinessId(customerId, businessId)
                .orElseThrow(CustomerNotFoundException::new);
    }

    private Lead findLead(UUID leadId, UUID businessId) {
        if (leadId == null) {
            return null;
        }

        return leadRepository.findByIdAndBusinessId(leadId, businessId)
                .orElseThrow(LeadNotFoundException::new);
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}

