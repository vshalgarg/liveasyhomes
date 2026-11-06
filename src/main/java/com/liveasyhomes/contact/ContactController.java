package com.liveasyhomes.contact;

import com.liveasyhomes.contact.dto.ContactRequest;
import com.liveasyhomes.contact.dto.ContactResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

  private final ContactService contactService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ContactResponse create(@Valid @RequestBody ContactRequest request) {
    return contactService.create(request);
  }
}
