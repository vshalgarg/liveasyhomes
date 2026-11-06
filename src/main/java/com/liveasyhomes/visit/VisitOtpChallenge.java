package com.liveasyhomes.visit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "visit_otp_challenges")
public class VisitOtpChallenge {

  @Id
  private UUID id;

  @Column(nullable = false, unique = true, length = 10)
  private String phone;

  @Column(nullable = false, length = 64)
  private String codeHash;

  @Column(nullable = false)
  private Instant expiresAt;

  @Column(nullable = false, length = 80)
  private String name;

  @Column(nullable = false, length = 160)
  private String email;

  @Column(nullable = false, length = 160)
  private String propertySlug;

  @Column(nullable = false, length = 120)
  private String propertyTitle;

  /** Wrong guesses for this code. A new send resets it. */
  @Column(name = "failed_attempts")
  private Integer failedAttempts = 0;

  @PrePersist
  void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
  }
}
