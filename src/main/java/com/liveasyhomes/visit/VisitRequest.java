package com.liveasyhomes.visit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
    name = "visit_requests",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_visit_requests_phone_property_status",
        columnNames = {"phone", "property_slug", "status"}
    )
)
public class VisitRequest {

  @Id
  private UUID id;

  @Column(name = "property_slug", nullable = false, length = 160)
  private String propertySlug;

  @Column(name = "property_title", nullable = false, length = 120)
  private String propertyTitle;

  @Column(nullable = false, length = 80)
  private String name;

  @Column(nullable = false, length = 160)
  private String email;

  /** Firebase-verified number in E.164, for example +919876543210. */
  @Column(nullable = false, length = 20)
  private String phone;

  @Column(name = "firebase_uid", nullable = false, length = 128)
  private String firebaseUid;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private VisitRequestStatus status;

  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @PrePersist
  void onCreate() {
    Instant now = Instant.now();
    if (id == null) {
      id = UUID.randomUUID();
    }
    if (createdAt == null) {
      createdAt = now;
    }
    updatedAt = now;
    if (status == null) {
      status = VisitRequestStatus.REQUESTED;
    }
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }
}
