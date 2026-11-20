package com.liveasyhomes.visit;

import com.liveasyhomes.common.error.ApiException;
import com.liveasyhomes.visit.dto.VisitRequestBody;
import com.liveasyhomes.visit.dto.VisitRequestResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/visits/request", "/api/visit-requests"})
@RequiredArgsConstructor
public class VisitRequestController {

  private final VisitRequestService visitRequests;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public VisitRequestResponse create(
      @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
      @Valid @RequestBody VisitRequestBody body
  ) {
    if (authorization == null || authorization.isBlank()) {
      throw new ApiException(401, "Authentication required.");
    }
    return visitRequests.submit(authorization, body);
  }
}
