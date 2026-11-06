package com.liveasyhomes.visit;

import com.liveasyhomes.visit.dto.OtpSentResponse;
import com.liveasyhomes.visit.dto.SendOtpRequest;
import com.liveasyhomes.visit.dto.VerifyOtpRequest;
import com.liveasyhomes.visit.dto.VisitBookedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/visits/otp")
@RequiredArgsConstructor
public class VisitController {

  private final VisitService visits;

  @PostMapping("/send")
  public OtpSentResponse send(@Valid @RequestBody SendOtpRequest request) {
    return visits.send(request);
  }

  @PostMapping("/verify")
  public VisitBookedResponse verify(@Valid @RequestBody VerifyOtpRequest request) {
    return visits.verify(request);
  }
}
