package com.liveasyhomes.common.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.liveasyhomes.common.config.AppProperties;
import org.junit.jupiter.api.Test;

class FirebaseAdminAuthProviderTest {

  @Test
  void mapsAnExpiredFirebaseToken() throws Exception {
    FirebaseAuth auth = mock(FirebaseAuth.class);
    FirebaseAuthException expired = mock(FirebaseAuthException.class);
    when(expired.getAuthErrorCode()).thenReturn(AuthErrorCode.EXPIRED_ID_TOKEN);
    when(auth.verifyIdToken("expired-token", true)).thenThrow(expired);

    FirebaseAdminAuthProvider provider = provider(auth);

    FirebaseTokenRejectedException error = assertThrows(
        FirebaseTokenRejectedException.class,
        () -> provider.verify("expired-token")
    );
    assertEquals(FirebaseTokenRejectedException.Kind.EXPIRED, error.kind());
  }

  @Test
  void mapsAnInvalidFirebaseToken() throws Exception {
    FirebaseAuth auth = mock(FirebaseAuth.class);
    FirebaseAuthException invalid = mock(FirebaseAuthException.class);
    when(invalid.getAuthErrorCode()).thenReturn(AuthErrorCode.INVALID_ID_TOKEN);
    when(auth.verifyIdToken("bad-token", true)).thenThrow(invalid);

    FirebaseTokenRejectedException error = assertThrows(
        FirebaseTokenRejectedException.class,
        () -> provider(auth).verify("bad-token")
    );
    assertEquals(FirebaseTokenRejectedException.Kind.INVALID, error.kind());
  }

  @Test
  void returnsTheDecodedTokenWhenFirebaseAcceptsIt() throws Exception {
    FirebaseAuth auth = mock(FirebaseAuth.class);
    FirebaseToken decoded = mock(FirebaseToken.class);
    when(auth.verifyIdToken("good-token", true)).thenReturn(decoded);

    assertEquals(decoded, provider(auth).verify("good-token"));
  }

  @Test
  void reportsThatVerificationIsUnavailableWithoutAProject() {
    FirebaseAdminAuthProvider provider = new FirebaseAdminAuthProvider(new AppProperties(), null);

    FirebaseTokenRejectedException error = assertThrows(
        FirebaseTokenRejectedException.class,
        () -> provider.verify("any-token")
    );
    assertEquals(FirebaseTokenRejectedException.Kind.UNAVAILABLE, error.kind());
  }

  private static FirebaseAdminAuthProvider provider(FirebaseAuth auth) {
    AppProperties properties = new AppProperties();
    properties.getFirebase().setProjectId("liveasyhomes");
    return new FirebaseAdminAuthProvider(properties, token -> auth.verifyIdToken(token, true));
  }
}
