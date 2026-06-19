package com.callpilotai.customers;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Page<Customer> findByBusinessId(UUID businessId, Pageable pageable);

    @Query("""
            SELECT customer
            FROM Customer customer
            WHERE customer.business.id = :businessId
              AND (
                    LOWER(customer.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(customer.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(customer.email, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    Page<Customer> searchByBusinessId(
            @Param("businessId") UUID businessId,
            @Param("search") String search,
            Pageable pageable);

    Optional<Customer> findByIdAndBusinessId(UUID id, UUID businessId);
}
