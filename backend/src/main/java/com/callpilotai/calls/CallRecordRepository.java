package com.callpilotai.calls;

import java.time.Instant;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CallRecordRepository extends JpaRepository<CallRecord, UUID> {

    Page<CallRecord> findByBusinessId(UUID businessId, Pageable pageable);

    Page<CallRecord> findByBusinessIdAndCallStatus(UUID businessId, CallStatus status, Pageable pageable);

    long countByBusinessIdAndCreatedAtGreaterThanEqual(UUID businessId, Instant createdAt);

    long countByBusinessIdAndCallStatusIn(UUID businessId, Collection<CallStatus> statuses);

    @Query("""
            SELECT callRecord
            FROM CallRecord callRecord
            WHERE callRecord.business.id = :businessId
              AND (
                    LOWER(callRecord.callerPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.transcript, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.aiSummary, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.intent, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.urgency, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    Page<CallRecord> searchByBusinessId(
            @Param("businessId") UUID businessId,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT callRecord
            FROM CallRecord callRecord
            WHERE callRecord.business.id = :businessId
              AND callRecord.callStatus = :status
              AND (
                    LOWER(callRecord.callerPhone) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.transcript, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.aiSummary, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.intent, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(COALESCE(callRecord.urgency, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                  )
            """)
    Page<CallRecord> searchByBusinessIdAndStatus(
            @Param("businessId") UUID businessId,
            @Param("status") CallStatus status,
            @Param("search") String search,
            Pageable pageable);

    Optional<CallRecord> findByIdAndBusinessId(UUID id, UUID businessId);
}
