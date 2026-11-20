package com.liveasyhomes.common.security;

public interface FirebaseTokenVerifier {

  VerifiedCaller verifyAuthorization(String authorizationHeader);
}
