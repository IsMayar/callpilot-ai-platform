package com.callpilotai.customers;

import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.business.exception.BusinessNotFoundException;
import com.callpilotai.customers.dto.CustomerRequest;
import com.callpilotai.customers.dto.CustomerResponse;
import com.callpilotai.customers.exception.CustomerNotFoundException;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {

    private final BusinessRepository businessRepository;
    private final CustomerRepository customerRepository;

    public CustomerService(BusinessRepository businessRepository, CustomerRepository customerRepository) {
        this.businessRepository = businessRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponse> getCustomers(String ownerSubject, String search, Pageable pageable) {
        Business business = currentBusiness(ownerSubject);
        String normalizedSearch = normalizeNullable(search);

        Page<Customer> customers = normalizedSearch == null
                ? customerRepository.findByBusinessId(business.getId(), pageable)
                : customerRepository.searchByBusinessId(business.getId(), normalizedSearch, pageable);

        return customers
                .map(CustomerMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomer(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        Customer customer = customerRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(CustomerNotFoundException::new);

        return CustomerMapper.toResponse(customer);
    }

    @Transactional
    public CustomerResponse createCustomer(String ownerSubject, CustomerRequest request) {
        Business business = currentBusiness(ownerSubject);
        NormalizedCustomer normalized = normalize(request);
        Customer customer = new Customer(
                business,
                normalized.fullName(),
                normalized.phoneNumber(),
                normalized.email(),
                normalized.address(),
                normalized.notes());

        return CustomerMapper.toResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse updateCustomer(UUID id, String ownerSubject, CustomerRequest request) {
        Business business = currentBusiness(ownerSubject);
        Customer customer = customerRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(CustomerNotFoundException::new);
        NormalizedCustomer normalized = normalize(request);

        customer.update(
                normalized.fullName(),
                normalized.phoneNumber(),
                normalized.email(),
                normalized.address(),
                normalized.notes());

        return CustomerMapper.toResponse(customer);
    }

    @Transactional
    public void deleteCustomer(UUID id, String ownerSubject) {
        Business business = currentBusiness(ownerSubject);
        Customer customer = customerRepository.findByIdAndBusinessId(id, business.getId())
                .orElseThrow(CustomerNotFoundException::new);

        customerRepository.delete(customer);
    }

    private Business currentBusiness(String ownerSubject) {
        return businessRepository.findByOwnerSubject(ownerSubject)
                .orElseThrow(BusinessNotFoundException::new);
    }

    private NormalizedCustomer normalize(CustomerRequest request) {
        return new NormalizedCustomer(
                request.fullName().trim(),
                request.phoneNumber().trim(),
                normalizeNullable(request.email()),
                normalizeNullable(request.address()),
                normalizeNullable(request.notes()));
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private record NormalizedCustomer(
            String fullName,
            String phoneNumber,
            String email,
            String address,
            String notes) {
    }
}
