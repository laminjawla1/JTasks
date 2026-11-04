package com.jgroup.jtasks.commons;

import lombok.Builder;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Map;

@Builder
public record ApiErrorResponse(
        HttpStatus status,
        Map<String, String> errors,
        String path,
        Instant timestamp
) { }
