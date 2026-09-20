package com.skillswap.controller;

import com.skillswap.dto.*;
import com.skillswap.service.SkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        List<SkillDto> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/users/me/skills")
    public ResponseEntity<List<UserSkillDto>> getMySkills(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        List<UserSkillDto> userSkills = skillService.getUserSkillsByEmail(email);
        return ResponseEntity.ok(userSkills);
    }

    @PostMapping("/users/me/skills")
    public ResponseEntity<?> addUserSkill(Authentication authentication, @RequestBody AddUserSkillRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            UserSkillDto userSkill = skillService.addUserSkill(email, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(userSkill);
        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/users/me/skills/{id}")
    public ResponseEntity<?> updateUserSkill(Authentication authentication,
                                              @PathVariable Long id,
                                              @RequestBody UpdateUserSkillRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            UserSkillDto updated = skillService.updateUserSkill(email, id, request);
            return ResponseEntity.ok(updated);
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

    @DeleteMapping("/users/me/skills/{id}")
    public ResponseEntity<?> deleteUserSkill(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            String email = authentication.getName();
            skillService.deleteUserSkill(email, id);
            Map<String, String> message = new HashMap<>();
            message.put("message", "Skill removed successfully");
            return ResponseEntity.ok(message);
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
