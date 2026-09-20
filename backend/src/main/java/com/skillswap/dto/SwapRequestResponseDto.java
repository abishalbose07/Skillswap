package com.skillswap.dto;

import com.skillswap.model.SwapRequest;
import com.skillswap.model.SwapRequestStatus;
import java.time.LocalDateTime;

public class SwapRequestResponseDto {
    private Long id;
    private UserDto sender;
    private UserDto receiver;
    private SkillDto offeredSkill;
    private SkillDto requestedSkill;
    private String message;
    private SwapRequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SwapRequestResponseDto() {}

    public SwapRequestResponseDto(Long id, UserDto sender, UserDto receiver, SkillDto offeredSkill, SkillDto requestedSkill, String message, SwapRequestStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.sender = sender;
        this.receiver = receiver;
        this.offeredSkill = offeredSkill;
        this.requestedSkill = requestedSkill;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static SwapRequestResponseDto fromEntity(SwapRequest req) {
        return new SwapRequestResponseDto(
                req.getId(),
                UserDto.fromEntity(req.getSender()),
                UserDto.fromEntity(req.getReceiver()),
                SkillDto.fromEntity(req.getOfferedSkill()),
                SkillDto.fromEntity(req.getRequestedSkill()),
                req.getMessage(),
                req.getStatus(),
                req.getCreatedAt(),
                req.getUpdatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getSender() { return sender; }
    public void setSender(UserDto sender) { this.sender = sender; }

    public UserDto getReceiver() { return receiver; }
    public void setReceiver(UserDto receiver) { this.receiver = receiver; }

    public SkillDto getOfferedSkill() { return offeredSkill; }
    public void setOfferedSkill(SkillDto offeredSkill) { this.offeredSkill = offeredSkill; }

    public SkillDto getRequestedSkill() { return requestedSkill; }
    public void setRequestedSkill(SkillDto requestedSkill) { this.requestedSkill = requestedSkill; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public SwapRequestStatus getStatus() { return status; }
    public void setStatus(SwapRequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
