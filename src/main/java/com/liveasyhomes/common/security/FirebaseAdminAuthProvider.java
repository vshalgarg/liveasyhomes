package com.liveasyhomes.common.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.liveasyhomes.common.config.AppProperties;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class FirebaseAdminAuthProvider implements FirebaseIdTokenChecker {

  private static final String APP_NAME = "liveasyhomes";

  private final AppProperties properties;
  private final FirebaseAuthLookup lookup;
  private volatile FirebaseAuth cached;

  @Autowired
  public FirebaseAdminAuthProvider(AppProperties properties) {
    this(properties, null);
  }

  FirebaseAdminAuthProvider(AppProperties properties, FirebaseAuthLookup lookup) {
    this.properties = properties;
    this.lookup = lookup;
  }

  @Override
  public FirebaseToken verify(String idToken) {
    try {
      if (lookup != null) {
        return lookup.verify(idToken);
      }
      return auth().verifyIdToken(idToken, true);
    } catch (FirebaseAuthException ex) {
      if (ex.getAuthErrorCode() == AuthErrorCode.EXPIRED_ID_TOKEN) {
        throw new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.EXPIRED);
      }
      throw new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.INVALID);
    } catch (IllegalArgumentException ex) {
      throw new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.INVALID);
    }
  }

  @FunctionalInterface
  interface FirebaseAuthLookup {
    FirebaseToken verify(String idToken) throws FirebaseAuthException;
  }

  private FirebaseAuth auth() {
    FirebaseAuth current = cached;
    if (current != null) {
      return current;
    }
    synchronized (this) {
      if (cached != null) {
        return cached;
      }
      cached = FirebaseAuth.getInstance(initialize());
      return cached;
    }
  }

  private FirebaseApp initialize() {
    String projectId = properties.getFirebase().getProjectId();
    if (projectId == null || projectId.isBlank()) {
      throw new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.UNAVAILABLE);
    }
    synchronized (FirebaseApp.class) {
      for (FirebaseApp app : FirebaseApp.getApps()) {
        if (APP_NAME.equals(app.getName())) {
          return app;
        }
      }
      try {
        FirebaseOptions options = FirebaseOptions.builder()
            .setProjectId(projectId)
            .setCredentials(credentials())
            .build();
        return FirebaseApp.initializeApp(options, APP_NAME);
      } catch (IOException ex) {
        log.error("Firebase credentials could not be loaded");
        throw new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.UNAVAILABLE);
      }
    }
  }

  private GoogleCredentials credentials() throws IOException {
    String path = properties.getFirebase().getCredentialsPath();
    if (path != null && !path.isBlank()) {
      Path file = Path.of(path);
      if (!Files.isRegularFile(file)) {
        log.error("Firebase credentials file is missing");
        throw new FirebaseTokenRejectedException(FirebaseTokenRejectedException.Kind.UNAVAILABLE);
      }
      try (InputStream input = Files.newInputStream(file)) {
        return GoogleCredentials.fromStream(input);
      }
    }
    return GoogleCredentials.getApplicationDefault();
  }
}
