package com.callpilotai.leads;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeadRepository extends JpaRepository<Lead, UUID> {

    @Query("""
            SELECT lead
            FROM Lead lead
            WHERE lead.business.id = :businessId
              AND (:status IS NULL OR lead.status = :status)
              AND (:search IS NULL OR LOWER(lead.customerName) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<Lead> searchByBusiness(
            @Param("businessId") UUID businessId,
            @Param("search") String search,
            @Param("status") LeadStatus status,
            Pageable pageable);

    Optional<Lead> findByIdAndBusinessId(UUID id, UUID businessId);
}

