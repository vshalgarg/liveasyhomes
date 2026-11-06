package com.liveasyhomes.property;

import com.liveasyhomes.auth.Role;
import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.security.CurrentUser;
import com.liveasyhomes.common.security.UserPrincipal;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PropertyAccess {

  private final PropertyRepository properties;

  public Property requireReadable(String ref) {
    Property property = require(ref);
    if (property.getStatus() == PropertyStatus.PUBLISHED) {
      return property;
    }
    UserPrincipal current = CurrentUser.get().orElse(null);
    if (current != null && canManage(property, current)) {
      return property;
    }
    throw notFound();
  }

  public Property requireEditable(String ref) {
    Property property = require(ref);
    UserPrincipal current = CurrentUser.require();
    if (!canManage(property, current)) {
      throw new ApiException(403, "You do not have permission to edit this listing.");
    }
    return property;
  }

  private Property require(String ref) {
    return find(ref).orElseThrow(PropertyAccess::notFound);
  }

  private Optional<Property> find(String ref) {
    if (ref == null || ref.isBlank()) {
      return Optional.empty();
    }
    try {
      Optional<Property> byId = properties.findById(UUID.fromString(ref));
      if (byId.isPresent()) {
        return byId;
      }
    } catch (IllegalArgumentException ignored) {
      // Not a UUID; look up the public slug.
    }
    return properties.findBySlug(ref);
  }

  private static boolean canManage(Property property, UserPrincipal current) {
    if (current.role() == Role.ADMIN) {
      return true;
    }
    return current.role() == Role.LANDLORD
        && property.getOwner() != null
        && property.getOwner().getId().equals(current.id());
  }

  private static ApiException notFound() {
    return new ApiException(404, "Property not found.");
  }
}
