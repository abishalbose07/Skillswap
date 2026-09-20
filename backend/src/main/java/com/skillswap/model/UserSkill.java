package com.skillswap.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "skill_id", "type"})
})
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProficiencyLevel proficiencyLevel;

    public UserSkill() {}

    public UserSkill(Long id, User user, Skill skill, SkillType type, ProficiencyLevel proficiencyLevel) {
        this.id = id;
        this.user = user;
        this.skill = skill;
        this.type = type;
        this.proficiencyLevel = proficiencyLevel;
    }

    public UserSkill(User user, Skill skill, SkillType type, ProficiencyLevel proficiencyLevel) {
        this.user = user;
        this.skill = skill;
        this.type = type;
        this.proficiencyLevel = proficiencyLevel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public SkillType getType() { return type; }
    public void setType(SkillType type) { this.type = type; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
}
