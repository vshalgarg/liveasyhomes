package com.liveasyhomes.common.security;

import com.google.firebase.auth.FirebaseToken;
import com.liveasyhomes.common.error.ApiException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FirebaseIdTokenVerifier implements FirebaseTokenVerifier {

  private static final int MAX_TOKEN_LENGTH = 8192;

  private final FirebaseIdTokenChecker tokens;

  @Override
  public VerifiedCaller verifyAuthorization(String authorizationHeader) {
    FirebaseToken decoded;
    try {
      decoded = tokens.verify(bearer(authorizationHeader));
    } catch (FirebaseTokenRejectedException ex) {
      throw map(ex);
    }
    if (decoded == null || decoded.getUid() == null || decoded.getUid().isBlank() || !phoneProvider(decoded)) {
      throw new ApiException(401, "Authentication token is invalid.");
    }
    Object phone = decoded.getClaims().get("phone_number");
    if (!(phone instanceof String number) || number.isBlank()) {
      throw new ApiException(401, "Verified phone number is missing.");
    }
    return new VerifiedCaller(decoded.getUid(), number);
  }

  private static ApiException map(FirebaseTokenRejectedException ex) {
    return switch (ex.kind()) {
      case EXPIRED -> new ApiException(401, "Authentication token has expired.");
      case UNAVAILABLE -> new ApiException(503, "Phone verification is not configured.");
      case INVALID -> new ApiException(401, "Authentication token is invalid.");
    };
  }

  private static boolean phoneProvider(FirebaseToken decoded) {
    Object firebase = decoded.getClaims().get("firebase");
    if (!(firebase instanceof Map<?, ?> claims)) {
      return false;
    }
    return "phone".equals(claims.get("sign_in_provider"));
  }

  private static String bearer(String authorizationHeader) {
    if (authorizationHeader == null || !authorizationHeader.regionMatches(true, 0, "Bearer ", 0, 7)) {
      throw new ApiException(401, "Authentication required.");
    }
    String token = authorizationHeader.substring(7).trim();
    if (token.isEmpty() || token.length() > MAX_TOKEN_LENGTH) {
      throw new ApiException(401, "Authentication required.");
    }
    return token;
  }
}
