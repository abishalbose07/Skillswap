package com.skillswap.controller;

import com.skillswap.dto.CreateSwapRequestDto;
import com.skillswap.dto.SwapRequestResponseDto;
import com.skillswap.service.SwapRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/swap-requests")
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    public SwapRequestController(SwapRequestService swapRequestService) {
        this.swapRequestService = swapRequestService;
    }

    @PostMapping
    public ResponseEntity<?> createSwapRequest(Authentication authentication, @RequestBody CreateSwapRequestDto dto) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            SwapRequestResponseDto response = swapRequestService.createSwapRequest(email, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/sent")
    public ResponseEntity<List<SwapRequestResponseDto>> getSentRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        List<SwapRequestResponseDto> sent = swapRequestService.getSentRequests(email);
        return ResponseEntity.ok(sent);
    }

    @GetMapping("/received")
    public ResponseEntity<List<SwapRequestResponseDto>> getReceivedRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        List<SwapRequestResponseDto> received = swapRequestService.getReceivedRequests(email);
        return ResponseEntity.ok(received);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptSwapRequest(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            SwapRequestResponseDto response = swapRequestService.acceptSwapRequest(email, id);
            return ResponseEntity.ok(response);
        } catch (SecurityException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectSwapRequest(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            SwapRequestResponseDto response = swapRequestService.rejectSwapRequest(email, id);
            return ResponseEntity.ok(response);
        } catch (SecurityException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelSwapRequest(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            SwapRequestResponseDto response = swapRequestService.cancelSwapRequest(email, id);
            return ResponseEntity.ok(response);
        } catch (SecurityException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
