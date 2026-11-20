package com.liveasyhomes.common.security;

/** Raised by the Firebase adapter. The message must never contain the ID token. */
public class FirebaseTokenRejectedException extends RuntimeException {

  public enum Kind {
    EXPIRED,
    INVALID,
    UNAVAILABLE
  }

  private final Kind kind;

  public FirebaseTokenRejectedException(Kind kind) {
    this.kind = kind;
  }

  public Kind kind() {
    return kind;
  }
}
