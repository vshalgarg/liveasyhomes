package com.liveasyhomes.controller;

import com.liveasyhomes.media.StoredObject;
import com.liveasyhomes.service.R2StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/r2")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.storage.type", havingValue = "r2")
public class R2Controller {

  private final R2StorageService storage;

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAnyRole('ADMIN')")
  public StoredObject upload(@RequestParam("file") MultipartFile file) {
    return storage.upload(file);
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("hasAnyRole('ADMIN')")
  public void delete(@RequestParam String key) {
    storage.delete(key);
  }
}
