package com.liveasyhomes.common.error;

import java.util.LinkedHashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ErrorResponse> handleDenied(AccessDeniedException exception) {
    return ResponseEntity.status(403).body(ErrorResponse.of("You do not have permission to do that."));
  }

  @ExceptionHandler(AuthenticationException.class)
  ResponseEntity<ErrorResponse> handleUnauthenticated(AuthenticationException exception) {
    return ResponseEntity.status(401).body(ErrorResponse.of("Authentication required."));
  }

  @ExceptionHandler(ApiException.class)
  ResponseEntity<ErrorResponse> handleApi(ApiException exception) {
    return ResponseEntity.status(exception.getStatus()).body(ErrorResponse.of(exception.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
    Map<String, String> fields = new LinkedHashMap<>();
    exception.getBindingResult().getFieldErrors()
        .forEach(error -> fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
    return ResponseEntity.badRequest()
        .body(new ErrorResponse("Please check the form and try again.", fields));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  ResponseEntity<ErrorResponse> handleUnreadable(HttpMessageNotReadableException exception) {
    return ResponseEntity.badRequest().body(ErrorResponse.of("Request body is invalid."));
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException exception) {
    if ("files".equals(exception.getParameterName())) {
      return ResponseEntity.badRequest().body(ErrorResponse.of("Please upload at least one photo."));
    }
    return ResponseEntity.badRequest().body(ErrorResponse.of("Request is missing required data."));
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
    return ResponseEntity.badRequest().body(ErrorResponse.of("Request is invalid."));
  }

  @ExceptionHandler(MultipartException.class)
  ResponseEntity<ErrorResponse> handleMultipart(MultipartException exception) {
    if (hasUploadSizeCause(exception)) {
      return ResponseEntity.badRequest().body(ErrorResponse.of("Each photo must be 5 MB or smaller."));
    }
    return ResponseEntity.badRequest().body(ErrorResponse.of("Could not read the uploaded photos."));
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<ErrorResponse> handleConflict(DataIntegrityViolationException exception) {
    return ResponseEntity.status(409).body(ErrorResponse.of("That record already exists."));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ErrorResponse> handleUnexpected(Exception exception) {
    log.error("Unhandled API error", exception);
    return ResponseEntity.internalServerError()
        .body(ErrorResponse.of("Something went wrong. Please try again."));
  }

  private static boolean hasUploadSizeCause(Throwable throwable) {
    Throwable current = throwable;
    while (current != null) {
      if (current instanceof MaxUploadSizeExceededException) {
        return true;
      }
      current = current.getCause();
    }
    return false;
  }
}
