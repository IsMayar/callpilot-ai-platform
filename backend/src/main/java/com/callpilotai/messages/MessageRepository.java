package com.callpilotai.messages;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    Page<Message> findByBusinessId(UUID businessId, Pageable pageable);

    @Query("""
            SELECT message
            FROM Message message
            WHERE message.business.id = :businessId
              AND LOWER(message.body) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Message> searchByBusinessId(
            @Param("businessId") UUID businessId,
            @Param("search") String search,
            Pageable pageable);
}

