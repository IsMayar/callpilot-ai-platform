package com.callpilotai.aiconfig;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiReceptionistConfigRepository extends JpaRepository<AiReceptionistConfig, UUID> {

    Optional<AiReceptionistConfig> findByBusinessId(UUID businessId);
}
