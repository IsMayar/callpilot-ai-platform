package com.callpilotai.business;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessRepository extends JpaRepository<Business, UUID> {

    boolean existsByOwnerSubject(String ownerSubject);

    Optional<Business> findByOwnerSubject(String ownerSubject);

    Optional<Business> findByIdAndOwnerSubject(UUID id, String ownerSubject);
}

