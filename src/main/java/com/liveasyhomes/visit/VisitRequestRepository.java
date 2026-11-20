package com.liveasyhomes.visit;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitRequestRepository extends JpaRepository<VisitRequest, UUID> {

  boolean existsByPhoneAndPropertySlugAndStatus(String phone, String propertySlug, VisitRequestStatus status);
}
