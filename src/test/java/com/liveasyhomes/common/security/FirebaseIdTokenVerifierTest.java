package com.liveasyhomes.common.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.google.firebase.auth.FirebaseToken;
import com.liveasyhomes.common.error.ApiException;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FirebaseIdTokenVerifierTest {

  private FirebaseIdTokenChecker tokens;
  private FirebaseIdTokenVerifier verifier;

  @BeforeEach
  void setUp() {
    tokens = mock(FirebaseIdTokenChecker.class);
    verifier = new FirebaseIdTokenVerifier(tokens);
  }

  @Test
  void acceptsAPhoneAuthToken() {
    FirebaseToken decoded = phoneToken("uid-1", "+919876543210");
    when(tokens.verify("good-token")).thenReturn(decoded);

    VerifiedCaller caller = verifier.verifyAuthorization("Bearer good-token");

    assertEquals("uid-1", caller.uid());
    assertEquals("+919876543210", caller.phoneNumber());
  }

  @Test
  void rejectsAnInvalidToken() {
    when(tokens.verify("bad-token"))
        .thenThrow(new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.INVALID));

    ApiException error = assertThrows(ApiException.class, () -> verifier.verifyAuthorization("Bearer bad-token"));

    assertEquals(401, error.getStatus());
    assertEquals("Authentication token is invalid.", error.getMessage());
  }

  @Test
  void rejectsAnExpiredToken() {
    when(tokens.verify("expired-token"))
        .thenThrow(new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.EXPIRED));

    ApiException error = assertThrows(ApiException.class, () -> verifier.verifyAuthorization("Bearer expired-token"));

    assertEquals(401, error.getStatus());
    assertEquals("Authentication token has expired.", error.getMessage());
  }

  @Test
  void rejectsAMissingAuthorizationHeader() {
    ApiException error = assertThrows(ApiException.class, () -> verifier.verifyAuthorization(null));

    assertEquals(401, error.getStatus());
    assertEquals("Authentication required.", error.getMessage());
  }

  @Test
  void rejectsATokenWithoutAPhoneNumber() {
    FirebaseToken decoded = phoneToken("uid-1", " ");
    when(tokens.verify("no-phone")).thenReturn(decoded);

    ApiException error = assertThrows(ApiException.class, () -> verifier.verifyAuthorization("Bearer no-phone"));

    assertEquals(401, error.getStatus());
    assertEquals("Verified phone number is missing.", error.getMessage());
  }

  @Test
  void rejectsATokenThatIsNotPhoneAuth() {
    FirebaseToken token = mock(FirebaseToken.class);
    when(token.getUid()).thenReturn("uid-1");
    when(token.getClaims()).thenReturn(Map.of(
        "phone_number", "+919876543210",
        "firebase", Map.of("sign_in_provider", "google.com")
    ));
    when(tokens.verify("google-token")).thenReturn(token);

    ApiException error = assertThrows(ApiException.class, () -> verifier.verifyAuthorization("Bearer google-token"));

    assertEquals(401, error.getStatus());
  }

  private static FirebaseToken phoneToken(String uid, String phone) {
    FirebaseToken token = mock(FirebaseToken.class);
    when(token.getUid()).thenReturn(uid);
    when(token.getClaims()).thenReturn(Map.of(
        "phone_number", phone,
        "firebase", Map.of("sign_in_provider", "phone")
    ));
    return token;
  }
}
