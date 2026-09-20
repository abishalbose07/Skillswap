package com.skillswap.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_swaps")
public class SkillSwap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_one_id", nullable = false)
    private User userOne;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_two_id", nullable = false)
    private User userTwo;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_one_id", nullable = false)
    private Skill skillOne;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_two_id", nullable = false)
    private Skill skillTwo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SwapStatus status = SwapStatus.ACTIVE;

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public SkillSwap() {}

    public SkillSwap(User userOne, User userTwo, Skill skillOne, Skill skillTwo, SwapStatus status) {
        this.userOne = userOne;
        this.userTwo = userTwo;
        this.skillOne = skillOne;
        this.skillTwo = skillTwo;
        this.status = status != null ? status : SwapStatus.ACTIVE;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = SwapStatus.ACTIVE;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUserOne() { return userOne; }
    public void setUserOne(User userOne) { this.userOne = userOne; }

    public User getUserTwo() { return userTwo; }
    public void setUserTwo(User userTwo) { this.userTwo = userTwo; }

    public Skill getSkillOne() { return skillOne; }
    public void setSkillOne(Skill skillOne) { this.skillOne = skillOne; }

    public Skill getSkillTwo() { return skillTwo; }
    public void setSkillTwo(Skill skillTwo) { this.skillTwo = skillTwo; }

    public SwapStatus getStatus() { return status; }
    public void setStatus(SwapStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
