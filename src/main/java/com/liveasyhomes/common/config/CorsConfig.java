package com.liveasyhomes.common.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

  private final Environment environment;

  public CorsConfig(Environment environment) {
    this.environment = environment;
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource(AppProperties properties) {
    CorsConfiguration configuration = new CorsConfiguration();
    List<String> origins = parseOrigins(properties.getCors().getAllowedOrigins());
    if (production()) {
      configuration.setAllowedOrigins(origins);
    } else {
      configuration.setAllowedOriginPatterns(developmentPatterns(origins));
    }
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setExposedHeaders(List.of("Authorization"));
    configuration.setAllowCredentials(false);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  static List<String> parseOrigins(String raw) {
    if (raw == null || raw.isBlank()) {
      return List.of();
    }
    return Arrays.stream(raw.split(","))
        .map(String::trim)
        .filter(origin -> !origin.isEmpty())
        .toList();
  }

  /** Local and LAN addresses, any port, so the site can be opened from this machine or a phone. */
  static List<String> developmentPatterns(List<String> configured) {
    List<String> patterns = new ArrayList<>(configured);
    patterns.add("http://localhost:*");
    patterns.add("http://127.0.0.1:*");
    patterns.add("http://[::1]:*");
    patterns.add("http://192.168.*.*:*");
    patterns.add("http://10.*.*.*:*");
    patterns.add("http://172.*.*.*:*");
    return patterns;
  }

  private boolean production() {
    return Arrays.stream(environment.getActiveProfiles())
        .anyMatch(profile -> profile.equalsIgnoreCase("prod") || profile.equalsIgnoreCase("production"));
  }
}
