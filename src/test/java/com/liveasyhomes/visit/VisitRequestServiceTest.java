package com.liveasyhomes.visit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.common.security.FirebaseTokenVerifier;
import com.liveasyhomes.common.security.VerifiedCaller;
import com.liveasyhomes.property.Property;
import com.liveasyhomes.property.PropertyRepository;
import com.liveasyhomes.property.PropertyStatus;
import com.liveasyhomes.visit.dto.VisitRequestBody;
import com.liveasyhomes.visit.dto.VisitRequestResponse;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessResourceFailureException;

@ExtendWith(MockitoExtension.class)
class VisitRequestServiceTest {

  @Mock
  private FirebaseTokenVerifier tokens;

  @Mock
  private PropertyRepository properties;

  @Mock
  private VisitRequestStore store;

  @Mock
  private VisitNotificationSender notifications;

  private VisitRequestService service;

  @BeforeEach
  void setUp() {
    service = new VisitRequestService(tokens, properties, store, notifications);
  }

  @Test
  void savesARequestWhenThePhoneMatchesTheFirebaseToken() {
    Property property = published("secto-16", true);
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));
    when(properties.findBySlug("secto-16")).thenReturn(Optional.of(property));
    VisitRequest saved = savedRequest();
    when(store.create(any(), eq("Ada Lovelace"), eq("ada@example.com"), eq("+919876543210"), eq(property)))
        .thenReturn(saved);

    VisitRequestResponse response = service.submit("Bearer good", body("9876543210", "ada@example.com", "secto-16"));

    assertTrue(response.success());
    assertEquals("Visit request submitted successfully", response.message());
    assertEquals(saved.getId().toString(), response.data().requestId());
    assertEquals("REQUESTED", response.data().status());
    verify(notifications).send(saved);
  }

  @Test
  void rejectsAPhoneThatDoesNotMatchTheVerifiedNumber() {
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+14155552671"));
    when(properties.findBySlug("secto-16")).thenReturn(Optional.of(published("secto-16", true)));

    ApiException error = assertThrows(
        ApiException.class,
        () -> service.submit("Bearer good", body("9876543210", "ada@example.com", "secto-16"))
    );

    assertEquals(403, error.getStatus());
    verify(store, never()).create(any(), any(), any(), any(), any());
    verify(notifications, never()).send(any());
  }

  @Test
  void rejectsAnInvalidEmail() {
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));

    ApiException error = assertThrows(
        ApiException.class,
        () -> service.submit("Bearer good", body("9876543210", "not-an-email", "secto-16"))
    );

    assertEquals(400, error.getStatus());
    verify(properties, never()).findBySlug(any());
  }

  @Test
  void rejectsAMissingProperty() {
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));
    when(properties.findBySlug("missing")).thenReturn(Optional.empty());

    ApiException error = assertThrows(
        ApiException.class,
        () -> service.submit("Bearer good", body("9876543210", "ada@example.com", "missing"))
    );

    assertEquals(404, error.getStatus());
  }

  @Test
  void rejectsAnInactiveProperty() {
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));
    when(properties.findBySlug("secto-16")).thenReturn(Optional.of(published("secto-16", false)));

    ApiException error = assertThrows(
        ApiException.class,
        () -> service.submit("Bearer good", body("9876543210", "ada@example.com", "secto-16"))
    );

    assertEquals(403, error.getStatus());
    verify(store, never()).create(any(), any(), any(), any(), any());
  }

  @Test
  void hidesAnUnpublishedProperty() {
    Property draft = published("secto-16", true);
    draft.setStatus(PropertyStatus.DRAFT);
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));
    when(properties.findBySlug("secto-16")).thenReturn(Optional.of(draft));

    ApiException error = assertThrows(
        ApiException.class,
        () -> service.submit("Bearer good", body("9876543210", "ada@example.com", "secto-16"))
    );

    assertEquals(404, error.getStatus());
  }

  @Test
  void returnsConflictWhenTheStoreFindsADuplicate() {
    Property property = published("secto-16", true);
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));
    when(properties.findBySlug("secto-16")).thenReturn(Optional.of(property));
    when(store.create(any(), any(), any(), any(), eq(property)))
        .thenThrow(new ApiException(409, "A visit request for this home is already open."));

    ApiException error = assertThrows(
        ApiException.class,
        () -> service.submit("Bearer good", body("9876543210", "ada@example.com", "secto-16"))
    );

    assertEquals(409, error.getStatus());
    verify(notifications, never()).send(any());
  }

  @Test
  void letsADatabaseFailureReachTheCaller() {
    Property property = published("secto-16", true);
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));
    when(properties.findBySlug("secto-16")).thenReturn(Optional.of(property));
    when(store.create(any(), any(), any(), any(), eq(property)))
        .thenThrow(new DataAccessResourceFailureException("database unavailable"));

    assertThrows(
        DataAccessResourceFailureException.class,
        () -> service.submit("Bearer good", body("9876543210", "ada@example.com", "secto-16"))
    );
    verify(notifications, never()).send(any());
  }

  @Test
  void keepsTheSavedRequestWhenEmailFails() {
    Property property = published("secto-16", true);
    VisitRequest saved = savedRequest();
    when(tokens.verifyAuthorization("Bearer good")).thenReturn(new VerifiedCaller("uid-1", "+919876543210"));
    when(properties.findBySlug("secto-16")).thenReturn(Optional.of(property));
    when(store.create(any(), any(), any(), any(), eq(property))).thenReturn(saved);
    doThrow(new IllegalStateException("Resend returned HTTP 500")).when(notifications).send(saved);

    VisitRequestResponse response = service.submit("Bearer good", body("9876543210", "ada@example.com", "secto-16"));

    assertTrue(response.success());
    assertEquals(saved.getId().toString(), response.data().requestId());
    verify(store).create(any(), any(), any(), eq("+919876543210"), eq(property));
  }

  private static VisitRequest savedRequest() {
    VisitRequest request = new VisitRequest();
    request.setId(UUID.randomUUID());
    request.setStatus(VisitRequestStatus.REQUESTED);
    request.setPhone("+919876543210");
    return request;
  }

  private static Property published(String slug, boolean active) {
    Property property = new Property();
    property.setId(UUID.randomUUID());
    property.setSlug(slug);
    property.setTitle("Secto 16");
    property.setStatus(PropertyStatus.PUBLISHED);
    property.setActive(active);
    return property;
  }

  private static VisitRequestBody body(String phone, String email, String propertyId) {
    return new VisitRequestBody("Ada Lovelace", email, phone, propertyId);
  }
}
