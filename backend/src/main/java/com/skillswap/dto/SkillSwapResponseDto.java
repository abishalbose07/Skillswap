package com.skillswap.dto;

import com.skillswap.model.SkillSwap;
import com.skillswap.model.SwapStatus;
import java.time.LocalDateTime;

public class SkillSwapResponseDto {
    private Long id;
    private UserDto userOne;
    private UserDto userTwo;
    private SkillDto skillOne;
    private SkillDto skillTwo;
    private SwapStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public SkillSwapResponseDto() {}

    public SkillSwapResponseDto(Long id, UserDto userOne, UserDto userTwo, SkillDto skillOne, SkillDto skillTwo, SwapStatus status, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.id = id;
        this.userOne = userOne;
        this.userTwo = userTwo;
        this.skillOne = skillOne;
        this.skillTwo = skillTwo;
        this.status = status;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public static SkillSwapResponseDto fromEntity(SkillSwap swap) {
        return new SkillSwapResponseDto(
                swap.getId(),
                UserDto.fromEntity(swap.getUserOne()),
                UserDto.fromEntity(swap.getUserTwo()),
                SkillDto.fromEntity(swap.getSkillOne()),
                SkillDto.fromEntity(swap.getSkillTwo()),
                swap.getStatus(),
                swap.getCreatedAt(),
                swap.getCompletedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getUserOne() { return userOne; }
    public void setUserOne(UserDto userOne) { this.userOne = userOne; }

    public UserDto getUserTwo() { return userTwo; }
    public void setUserTwo(UserDto userTwo) { this.userTwo = userTwo; }

    public SkillDto getSkillOne() { return skillOne; }
    public void setSkillOne(SkillDto skillOne) { this.skillOne = skillOne; }

    public SkillDto getSkillTwo() { return skillTwo; }
    public void setSkillTwo(SkillDto skillTwo) { this.skillTwo = skillTwo; }

    public SwapStatus getStatus() { return status; }
    public void setStatus(SwapStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
