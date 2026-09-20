package com.skillswap.controller;

import com.skillswap.dto.SkillSwapResponseDto;
import com.skillswap.service.SkillSwapService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/swaps")
public class SkillSwapController {

    private final SkillSwapService skillSwapService;

    public SkillSwapController(SkillSwapService skillSwapService) {
        this.skillSwapService = skillSwapService;
    }

    @GetMapping
    public ResponseEntity<List<SkillSwapResponseDto>> getUserSwaps(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        List<SkillSwapResponseDto> swaps = skillSwapService.getUserSwaps(email);
        return ResponseEntity.ok(swaps);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSwapById(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            SkillSwapResponseDto swap = skillSwapService.getSwapById(email, id);
            return ResponseEntity.ok(swap);
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

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeSwap(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            SkillSwapResponseDto completed = skillSwapService.completeSwap(email, id);
            return ResponseEntity.ok(completed);
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

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSwap(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            SkillSwapResponseDto cancelled = skillSwapService.cancelSwap(email, id);
            return ResponseEntity.ok(cancelled);
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
