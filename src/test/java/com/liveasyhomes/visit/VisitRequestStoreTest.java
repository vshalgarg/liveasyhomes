package com.liveasyhomes.visit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.security.VerifiedCaller;
import com.liveasyhomes.property.Property;
import com.liveasyhomes.property.PropertyStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

@ExtendWith(MockitoExtension.class)
class VisitRequestStoreTest {

  @Mock
  private VisitRequestRepository requests;

  @InjectMocks
  private VisitRequestStore store;

  @Test
  void rejectsADuplicateOpenRequest() {
    when(requests.existsByPhoneAndPropertySlugAndStatus("+919876543210", "secto-16", VisitRequestStatus.REQUESTED))
        .thenReturn(true);

    ApiException error = assertThrows(ApiException.class, () -> store.create(
        new VerifiedCaller("uid-1", "+919876543210"),
        "Ada Lovelace",
        "ada@example.com",
        "+919876543210",
        property()
    ));

    assertEquals(409, error.getStatus());
    verify(requests, never()).saveAndFlush(any());
  }

  @Test
  void turnsAUniqueConstraintFailureIntoAConflict() {
    when(requests.existsByPhoneAndPropertySlugAndStatus("+919876543210", "secto-16", VisitRequestStatus.REQUESTED))
        .thenReturn(false);
    when(requests.saveAndFlush(any())).thenThrow(new DataIntegrityViolationException("duplicate"));

    ApiException error = assertThrows(ApiException.class, () -> store.create(
        new VerifiedCaller("uid-1", "+919876543210"),
        "Ada Lovelace",
        "ada@example.com",
        "+919876543210",
        property()
    ));

    assertEquals(409, error.getStatus());
  }

  private static Property property() {
    Property property = new Property();
    property.setSlug("secto-16");
    property.setTitle("Secto 16");
    property.setStatus(PropertyStatus.PUBLISHED);
    property.setActive(true);
    return property;
  }
}
