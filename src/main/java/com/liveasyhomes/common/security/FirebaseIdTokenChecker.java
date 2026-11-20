package com.liveasyhomes.common.security;

import com.google.firebase.auth.FirebaseToken;

public interface FirebaseIdTokenChecker {

  FirebaseToken verify(String idToken);
}
