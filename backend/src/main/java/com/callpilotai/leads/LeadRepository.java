package com.callpilotai.leads;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeadRepository extends JpaRepository<Lead, UUID> {

    Page<Lead> findByBusinessId(UUID businessId, Pageable pageable);

    Page<Lead> findByBusinessIdAndStatus(UUID businessId, LeadStatus status, Pageable pageable);

    @Query("""
            SELECT lead
            FROM Lead lead
            WHERE lead.business.id = :businessId
              AND LOWER(lead.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Lead> searchByBusinessId(
            @Param("businessId") UUID businessId,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT lead
            FROM Lead lead
            WHERE lead.business.id = :businessId
              AND lead.status = :status
              AND LOWER(lead.customerName) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Lead> searchByBusinessIdAndStatus(
            @Param("businessId") UUID businessId,
            @Param("status") LeadStatus status,
            @Param("search") String search,
            Pageable pageable);

    Optional<Lead> findByIdAndBusinessId(UUID id, UUID businessId);
}
