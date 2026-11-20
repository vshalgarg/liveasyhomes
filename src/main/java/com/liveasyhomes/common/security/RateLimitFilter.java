package com.liveasyhomes.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Limits anonymous writes that would otherwise be easy to flood:
 * login, signup, contact, visit OTP, and visit requests.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

  private static final long WINDOW_MILLIS = 60_000L;

  private final ConcurrentHashMap<String, Deque<Long>> hits = new ConcurrentHashMap<>();

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    int max = limitFor(request);
    if (max == 0) {
      filterChain.doFilter(request, response);
      return;
    }
    String key = request.getMethod() + " " + request.getRequestURI() + " " + request.getRemoteAddr();
    if (!allow(key, max)) {
      response.setStatus(429);
      response.setHeader("Retry-After", "60");
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");
      response.getWriter().write("{\"error\":\"Too many requests. Please wait and try again.\"}");
      return;
    }
    filterChain.doFilter(request, response);
  }

  private static int limitFor(HttpServletRequest request) {
    if (!HttpMethod.POST.matches(request.getMethod())) {
      return 0;
    }
    String path = request.getRequestURI();
    if (path.endsWith("/api/auth/login")) {
      return 10;
    }
    if (path.endsWith("/api/auth/register") || path.endsWith("/api/contact")) {
      return 5;
    }
    if (path.endsWith("/api/visits/otp/send")) {
      return 3;
    }
    if (path.endsWith("/api/visits/otp/verify")) {
      return 8;
    }
    if (path.endsWith("/api/visits/request") || path.endsWith("/api/visit-requests")) {
      return 5;
    }
    return 0;
  }

  private boolean allow(String key, int max) {
    long now = System.currentTimeMillis();
    Deque<Long> window = hits.computeIfAbsent(key, ignored -> new ArrayDeque<>());
    synchronized (window) {
      while (!window.isEmpty() && now - window.peekFirst() > WINDOW_MILLIS) {
        window.removeFirst();
      }
      if (window.size() >= max) {
        return false;
      }
      window.addLast(now);
      return true;
    }
  }

  /** Test hook. The window is process-wide, so API tests clear it between cases. */
  public void resetForTests() {
    hits.clear();
  }
}
