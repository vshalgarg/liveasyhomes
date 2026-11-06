package com.liveasyhomes.visit;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitBookingRepository extends JpaRepository<VisitBooking, UUID> {
}
