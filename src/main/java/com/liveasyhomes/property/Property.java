package com.liveasyhomes.property;

import com.liveasyhomes.auth.UserAccount;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "properties", indexes = {
    @Index(name = "idx_properties_status", columnList = "status"),
    @Index(name = "idx_properties_city", columnList = "city"),
    @Index(name = "idx_properties_section", columnList = "section")
})
public class Property {

  @Id
  private UUID id;

  /** Public id used in URLs such as /listings/maple-heights. */
  @Column(nullable = false, unique = true, length = 160)
  private String slug;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_id")
  private UserAccount owner;

  @Column(nullable = false, length = 120)
  private String title;

  @Column(nullable = false, length = 180)
  private String location;

  @Column(nullable = false, length = 80)
  private String city;

  private Double lat;
  private Double lng;

  /** Monthly rent in rupees, before Indian grouping. */
  @Column(nullable = false)
  private long priceAmount;

  @Column(nullable = false)
  private int beds;

  @Column(nullable = false)
  private int baths;

  @Column(nullable = false)
  private int area;

  @Column(nullable = false, length = 40)
  private String tag;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ListingSection section;

  @Column(nullable = false, length = 40)
  private String propertyType;

  @Column(nullable = false, length = 20)
  private String floorPlan = "1 BHK";

  @Column(nullable = false, length = 40)
  private String furnished;

  @Column(nullable = false, length = 80)
  private String availableFrom;

  /** One-time onboarding charge in INR (whole rupees). */
  @Column(nullable = false)
  private Long onboardingCharge = 0L;

  @Column(nullable = false, length = 80)
  private String deposit;

  @Column(nullable = false, length = 80)
  private String maintenance;

  @Column(nullable = false, length = 5000)
  private String description;

  @ElementCollection
  @CollectionTable(name = "property_highlights", joinColumns = @JoinColumn(name = "property_id"))
  @OrderColumn(name = "sort_order")
  @Column(name = "highlight", nullable = false, length = 240)
  @BatchSize(size = 32)
  private List<String> highlights = new ArrayList<>();

  @ElementCollection
  @CollectionTable(name = "property_rent_excludes", joinColumns = @JoinColumn(name = "property_id"))
  @OrderColumn(name = "sort_order")
  @Column(name = "item", nullable = false, length = 240)
  @BatchSize(size = 32)
  private List<String> rentExcludes = new ArrayList<>();

  @ElementCollection
  @CollectionTable(name = "property_liveasy_manages", joinColumns = @JoinColumn(name = "property_id"))
  @OrderColumn(name = "sort_order")
  @Column(name = "item", nullable = false, length = 240)
  @BatchSize(size = 32)
  private List<String> liveasyManages = new ArrayList<>();

  @ElementCollection
  @CollectionTable(name = "property_owner_responsibilities", joinColumns = @JoinColumn(name = "property_id"))
  @OrderColumn(name = "sort_order")
  @Column(name = "item", nullable = false, length = 240)
  @BatchSize(size = 32)
  private List<String> ownerResponsibilities = new ArrayList<>();

  @Column(name = "terms_and_conditions", nullable = false, length = 5000)
  @ColumnDefault("''")
  private String termsAndConditions = "";

  @ElementCollection
  @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
  @OrderColumn(name = "sort_order")
  @BatchSize(size = 32)
  private List<Amenity> amenities = new ArrayList<>();

  @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
  @OrderBy("sortOrder ASC")
  @BatchSize(size = 32)
  private List<PropertyPhoto> photos = new ArrayList<>();

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private PropertyStatus status;

  /** Public listings stay visible while this is true. */
  @Column(name = "is_active", nullable = false)
  @ColumnDefault("true")
  private boolean isActive = true;

  @Column(nullable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  public void addPhoto(PropertyPhoto photo) {
    photos.add(photo);
    photo.setProperty(this);
  }

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
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }
}
