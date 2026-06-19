package com.callpilotai.team;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {

    Page<TeamMember> findByBusinessId(UUID businessId, Pageable pageable);

    Optional<TeamMember> findByIdAndBusinessId(UUID id, UUID businessId);

    Optional<TeamMember> findByBusinessIdAndEmailIgnoreCase(UUID businessId, String email);
}
