package com.skillswap.dto;

public class CreateSwapRequestDto {
    private Long receiverId;
    private Long offeredSkillId;
    private Long requestedSkillId;
    private String message;

    public CreateSwapRequestDto() {}

    public CreateSwapRequestDto(Long receiverId, Long offeredSkillId, Long requestedSkillId, String message) {
        this.receiverId = receiverId;
        this.offeredSkillId = offeredSkillId;
        this.requestedSkillId = requestedSkillId;
        this.message = message;
    }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public Long getOfferedSkillId() { return offeredSkillId; }
    public void setOfferedSkillId(Long offeredSkillId) { this.offeredSkillId = offeredSkillId; }

    public Long getRequestedSkillId() { return requestedSkillId; }
    public void setRequestedSkillId(Long requestedSkillId) { this.requestedSkillId = requestedSkillId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
