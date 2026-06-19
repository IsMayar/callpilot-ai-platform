package com.callpilotai.customers;

import com.callpilotai.customers.dto.CustomerResponse;

final class CustomerMapper {

    private CustomerMapper() {
    }

    static CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getBusiness().getId(),
                customer.getFullName(),
                customer.getPhoneNumber(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getNotes(),
                customer.getCreatedAt(),
                customer.getUpdatedAt());
    }
}

