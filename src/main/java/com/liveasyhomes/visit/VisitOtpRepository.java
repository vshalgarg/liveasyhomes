package com.liveasyhomes.visit;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitOtpRepository extends JpaRepository<VisitOtpChallenge, UUID> {

  Optional<VisitOtpChallenge> findByPhone(String phone);
}
