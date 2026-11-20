package com.liveasyhomes.common.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;
import org.springframework.web.cors.CorsConfiguration;

class CorsConfigTest {

  @Test
  void developmentAllowsLocalAndLanOrigins() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(
        CorsConfig.developmentPatterns(CorsConfig.parseOrigins("http://localhost:3000"))
    );

    assertEquals("http://localhost:3001", configuration.checkOrigin("http://localhost:3001"));
    assertEquals("http://192.168.1.67:3001", configuration.checkOrigin("http://192.168.1.67:3001"));
    assertNull(configuration.checkOrigin("https://evil.example"));
  }
}
