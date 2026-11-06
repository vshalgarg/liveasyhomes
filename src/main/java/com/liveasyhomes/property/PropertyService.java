package com.liveasyhomes.property;

import com.liveasyhomes.auth.Role;
import com.liveasyhomes.auth.UserAccount;
import com.liveasyhomes.auth.UserAccountRepository;
import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.web.RichTextSanitizer;
import com.liveasyhomes.common.security.CurrentUser;
import com.liveasyhomes.common.security.UserPrincipal;
import com.liveasyhomes.common.web.PageResponse;
import com.liveasyhomes.media.StorageService;
import com.liveasyhomes.property.dto.PropertyRequest;
import com.liveasyhomes.property.dto.PropertyResponse;
import com.liveasyhomes.property.dto.PropertySearchCriteria;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PropertyService {

  static final List<String> DEFAULT_HIGHLIGHTS = List.of(
      "Listed on LiveEasy Homes",
      "Professionally managed experience",
      "Book a free visit anytime"
  );

  private static final Set<String> PROPERTY_TYPES = Set.of(
      "Gated Apartment",
      "Independent House",
      "Independent Villa",
      "Shared Service Apartment",
      "Builder Floor"
  );
  private static final Set<String> FURNISHED = Set.of(
      "Fully furnished", "Semi-furnished", "Unfurnished"
  );
  private static final Set<String> FLOOR_PLANS = Set.of(
      "1RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"
  );

  private final PropertyRepository properties;
  private final UserAccountRepository users;
  private final PropertyAccess access;
  private final PropertyMapper mapper;
  private final StorageService storage;

  @Transactional(readOnly = true)
  public PageResponse<PropertyResponse> list(PropertySearchCriteria criteria) {
    if (criteria.minPrice() != null && criteria.maxPrice() != null && criteria.minPrice() > criteria.maxPrice()) {
      throw new ApiException(400, "minPrice cannot be greater than maxPrice.");
    }
    if (criteria.beds() != null && criteria.beds() < 0) {
      throw new ApiException(400, "Bedrooms cannot be negative.");
    }
    if (criteria.section() != null && !criteria.section().isBlank()) {
      ListingSection.from(criteria.section());
    }

    int page = Math.max(criteria.page(), 0);
    int size = criteria.size() <= 0 ? 20 : Math.min(criteria.size(), 50);
    Page<Property> result = properties.findAll(
        specification(criteria),
        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
    );
    return new PageResponse<>(
        result.getContent().stream().map(mapper::toResponse).toList(),
        result.getNumber(),
        result.getSize(),
        result.getTotalElements(),
        result.getTotalPages()
    );
  }

  @Transactional(readOnly = true)
  public PropertyResponse get(String id) {
    return mapper.toResponse(access.requireReadable(id));
  }

  @Transactional
  public PropertyResponse create(PropertyRequest request) {
    UserPrincipal current = CurrentUser.require();
    UserAccount owner = users.findById(current.id())
        .orElseThrow(() -> new ApiException(401, "Authentication required."));

    Property property = new Property();
    apply(request, property, true);
    property.setSlug(SlugGenerator.unique(request.title(), properties::existsBySlug));
    property.setOwner(owner);
    return mapper.toResponse(properties.save(property));
  }

  @Transactional
  public PropertyResponse update(String id, PropertyRequest request) {
    Property property = access.requireEditable(id);
    apply(request, property, false);
    return mapper.toResponse(properties.save(property));
  }

  @Transactional
  public void delete(String id) {
    Property property = access.requireEditable(id);
    for (PropertyPhoto photo : property.getPhotos()) {
      if (photo.getStorageKey() != null && !photo.getStorageKey().isBlank()) {
        storage.delete(photo.getStorageKey());
      }
    }
    properties.delete(property);
  }

  private void apply(PropertyRequest request, Property property, boolean creating) {
    property.setTitle(request.title().trim());
    property.setLocation(request.location().trim());
    property.setCity(blankToDefault(request.city(), "Bangalore"));
    property.setPriceAmount(PriceFormat.parse(request.price()));
    property.setBeds(request.beds());
    property.setBaths(request.baths());
    property.setArea(request.area());
    property.setPropertyType(canonical(request.propertyType(), PROPERTY_TYPES, "Property type must be Gated Apartment, Independent House, Independent Villa, Shared Service Apartment, or Builder Floor."));
    property.setFloorPlan(canonical(blankToDefault(request.floorPlan(), "1 BHK"), FLOOR_PLANS, "Floor plan must be 1RK, 1 BHK, 2 BHK, 3 BHK, 4 BHK, or 5 BHK."));
    property.setFurnished(canonical(request.furnished(), FURNISHED, "Furnishing must be Fully furnished, Semi-furnished, or Unfurnished."));
    property.setAvailableFrom(blankToDefault(request.availableFrom(), "Immediate move-in"));
    property.setOnboardingCharge(request.onboardingCharge() == null ? 0L : Math.max(0L, request.onboardingCharge()));
    property.setDeposit(blankToDefault(request.deposit(), "2 months rent"));
    property.setMaintenance(blankToDefault(request.maintenance(), "Included in rent"));
    String description = RichTextSanitizer.clean(request.description());
    if (description.isBlank()) {
      throw new ApiException(400, "Please add a short description.");
    }
    property.setDescription(description);
    property.setTag(blankToDefault(request.tag(), creating ? "New" : blankToDefault(property.getTag(), "New")));

    ListingSection section = blank(request.section()) ? null : ListingSection.from(request.section());
    if (section != null) {
      property.setSection(section);
    } else if (creating || property.getSection() == null) {
      property.setSection(ListingSection.NEW);
    }

    if (request.status() != null) {
      property.setStatus(request.status());
    } else if (creating || property.getStatus() == null) {
      property.setStatus(PropertyStatus.PUBLISHED);
    }

    if (request.isActive() != null) {
      property.setActive(request.isActive());
    } else if (creating) {
      property.setActive(true);
    }

    if (request.lat() != null && request.lng() != null) {
      if (request.lat() < -90 || request.lat() > 90 || request.lng() < -180 || request.lng() > 180) {
        throw new ApiException(400, "Latitude or longitude is out of range.");
      }
      property.setLat(request.lat());
      property.setLng(request.lng());
    } else if (request.lat() == null && request.lng() == null) {
      LocationCoordinates.Coords coords = LocationCoordinates.resolve(property.getLocation());
      property.setLat(coords.lat());
      property.setLng(coords.lng());
    } else {
      throw new ApiException(400, "Provide both latitude and longitude, or leave both empty.");
    }

    List<String> highlights = request.highlights() == null
        ? List.of()
        : request.highlights().stream().map(String::trim).filter(line -> !line.isEmpty()).toList();
    property.getHighlights().clear();
    property.getHighlights().addAll(highlights.isEmpty() ? DEFAULT_HIGHLIGHTS : highlights);

    replaceItems(property.getRentExcludes(), request.rentExcludes(), creating);
    replaceItems(property.getLiveasyManages(), request.liveasyManages(), creating);
    replaceItems(property.getOwnerResponsibilities(), request.ownerResponsibilities(), creating);
    if (request.termsAndConditions() != null) {
      property.setTermsAndConditions(RichTextSanitizer.clean(request.termsAndConditions()));
    } else if (creating || property.getTermsAndConditions() == null) {
      property.setTermsAndConditions("");
    }

    property.getAmenities().clear();
    property.getAmenities().addAll(AmenityCatalog.resolve(request.amenities()));
  }

  private static void replaceItems(List<String> target, List<String> incoming, boolean creating) {
    if (incoming == null) {
      if (creating) {
        target.clear();
      }
      return;
    }
    List<String> cleaned = incoming.stream().map(String::trim).filter(line -> !line.isEmpty()).toList();
    target.clear();
    target.addAll(cleaned);
  }

  private Specification<Property> specification(PropertySearchCriteria criteria) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      predicates.add(visibility(root, cb, criteria));

      if (!blank(criteria.section())) {
        predicates.add(cb.equal(root.get("section"), ListingSection.from(criteria.section())));
      }
      if (!blank(criteria.city())) {
        predicates.add(cb.equal(cb.lower(root.get("city")), criteria.city().trim().toLowerCase(Locale.ROOT)));
      }
      if (!blank(criteria.location())) {
        predicates.add(cb.like(
            cb.lower(root.get("location")),
            "%" + criteria.location().trim().toLowerCase(Locale.ROOT) + "%"
        ));
      }
      if (criteria.minPrice() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("priceAmount"), criteria.minPrice()));
      }
      if (criteria.maxPrice() != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("priceAmount"), criteria.maxPrice()));
      }
      if (!blank(criteria.propertyType())) {
        predicates.add(cb.equal(
            cb.lower(root.get("propertyType")),
            criteria.propertyType().trim().toLowerCase(Locale.ROOT)
        ));
      }
      if (criteria.beds() != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("beds"), criteria.beds()));
      }
      if (!blank(criteria.q())) {
        String like = "%" + criteria.q().trim().toLowerCase(Locale.ROOT) + "%";
        predicates.add(cb.or(
            cb.like(cb.lower(root.get("title")), like),
            cb.like(cb.lower(root.get("location")), like),
            cb.like(cb.lower(root.get("city")), like),
            cb.like(cb.lower(root.get("description")), like)
        ));
      }
      return cb.and(predicates.toArray(Predicate[]::new));
    };
  }

  private Predicate visibility(
      jakarta.persistence.criteria.Root<Property> root,
      jakarta.persistence.criteria.CriteriaBuilder cb,
      PropertySearchCriteria criteria
  ) {
    UserPrincipal current = CurrentUser.get().orElse(null);
    if (criteria.status() != null) {
      if (current == null || current.role() != Role.ADMIN) {
        throw new ApiException(403, "You do not have permission to filter by status.");
      }
      return cb.equal(root.get("status"), criteria.status());
    }
    if (criteria.mine()) {
      if (current == null) {
        throw new ApiException(401, "Authentication required.");
      }
      if (current.role() == Role.ADMIN) {
        return cb.conjunction();
      }
      return cb.equal(root.get("owner").get("id"), current.id());
    }
    return cb.equal(root.get("status"), PropertyStatus.PUBLISHED);
  }

  private static String canonical(String raw, Set<String> allowed, String message) {
    return allowed.stream()
        .filter(option -> option.equalsIgnoreCase(raw.trim()))
        .findFirst()
        .orElseThrow(() -> new ApiException(400, message));
  }

  private static String blankToDefault(String value, String fallback) {
    return blank(value) ? fallback : value.trim();
  }

  private static boolean blank(String value) {
    return value == null || value.isBlank();
  }
}
