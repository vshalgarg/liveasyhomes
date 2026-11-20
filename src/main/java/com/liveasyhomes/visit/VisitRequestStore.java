package com.liveasyhomes.visit;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.security.VerifiedCaller;
import com.liveasyhomes.property.Property;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VisitRequestStore {

  private final VisitRequestRepository requests;

  @Transactional
  public VisitRequest create(VerifiedCaller caller, String name, String email, String phone, Property property) {
    if (requests.existsByPhoneAndPropertySlugAndStatus(phone, property.getSlug(), VisitRequestStatus.REQUESTED)) {
      throw new ApiException(409, "A visit request for this home is already open.");
    }
    VisitRequest request = new VisitRequest();
    request.setPropertySlug(property.getSlug());
    request.setPropertyTitle(property.getTitle());
    request.setName(name);
    request.setEmail(email);
    request.setPhone(phone);
    request.setFirebaseUid(caller.uid());
    request.setStatus(VisitRequestStatus.REQUESTED);
    try {
      return requests.saveAndFlush(request);
    } catch (DataIntegrityViolationException ex) {
      throw new ApiException(409, "A visit request for this home is already open.");
    }
  }
}
