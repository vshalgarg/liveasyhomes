package com.liveasyhomes.common.security;

/** Identity taken from a verified Firebase phone-auth ID token. */
public record VerifiedCaller(String uid, String phoneNumber) {
}
