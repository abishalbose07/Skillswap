package com.skillswap.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "swap_requests")
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "offered_skill_id", nullable = false)
    private Skill offeredSkill;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "requested_skill_id", nullable = false)
    private Skill requestedSkill;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SwapRequestStatus status = SwapRequestStatus.PENDING;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SwapRequest() {}

    public SwapRequest(User sender, User receiver, Skill offeredSkill, Skill requestedSkill, String message, SwapRequestStatus status) {
        this.sender = sender;
        this.receiver = receiver;
        this.offeredSkill = offeredSkill;
        this.requestedSkill = requestedSkill;
        this.message = message;
        this.status = status != null ? status : SwapRequestStatus.PENDING;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = SwapRequestStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }

    public Skill getOfferedSkill() { return offeredSkill; }
    public void setOfferedSkill(Skill offeredSkill) { this.offeredSkill = offeredSkill; }

    public Skill getRequestedSkill() { return requestedSkill; }
    public void setRequestedSkill(Skill requestedSkill) { this.requestedSkill = requestedSkill; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public SwapRequestStatus getStatus() { return status; }
    public void setStatus(SwapRequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
