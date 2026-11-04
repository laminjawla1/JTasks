package com.jgroup.jtasks.exceptions;

import com.jgroup.jtasks.commons.ApiErrorResponse;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleEntityNotFound(EntityNotFoundException e, HttpServletRequest req) {
        var res = ApiErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND)
                .errors(Map.of("message", e.getMessage()))
                .timestamp(Instant.now())
                .path(req.getRequestURI())
                .build();
        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiErrorResponse> handleSecurityException(SecurityException e, HttpServletRequest req) {
        var res = ApiErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED)
                .errors(Map.of("message", e.getMessage()))
                .timestamp(Instant.now())
                .path(req.getRequestURI())
                .build();
        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
    }

    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEntityExistsException(EntityExistsException e, HttpServletRequest request) {
        ApiErrorResponse res = ApiErrorResponse.builder()
                .status(HttpStatus.CONFLICT)
                .errors(Map.of("message", e.getMessage()))
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
        ApiErrorResponse res = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .errors(Map.of("message", e.getMessage()))
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationExceptions(MethodArgumentNotValidException e, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .errors(errors)
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        log.error("Error:", e);
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> methodArgumentTypeMismatchExceptionHandler(
            MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        String message = "Type mismatched for property '" + e.getName() + "'.";
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .errors(Map.of("message", message))
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();
        log.error("Error:", e);
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e, HttpServletRequest request) {
        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .errors(Map.of("message", "The request body is missing or has an invalid format."))
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();
        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException e, HttpServletRequest request) {
        String message = "Data integrity violation";
        String field = "dataIntegrity";
        if (e.getMessage().contains("email")) {
            message = "Email already exists";
            field = "email";
        }

        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.CONFLICT)
                .errors(Map.of(field, message))
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

//    @ExceptionHandler(MailAuthenticationException.class)
//    public ResponseEntity<ApiErrorResponse> handleMailAuthenticationException(MailAuthenticationException e, HttpServletRequest request) {
//        String message = "Unable to send email. Please contact support.";
//        ApiErrorResponse error = ApiErrorResponse.builder()
//                .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .errors(Map.of("message", message))
//                .path(request.getRequestURI())
//                .timestamp(LocalDateTime.now())
//                .build();
//        log.error("Error: {} - {}", e.getMessage(), e);
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
//    }

    // Business-rule violations (e.g. "already approved"). The message is written for users, so it is returned as-is.
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalStateException(IllegalStateException e, HttpServletRequest request) {
        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.CONFLICT)
                .errors(Map.of("message", e.getMessage()))
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // Covers @PreAuthorize denials and access checks thrown from services.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException e, HttpServletRequest request) {
        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN)
                .errors(Map.of("message", e.getMessage()))
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        log.error("Error:", e);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

}
