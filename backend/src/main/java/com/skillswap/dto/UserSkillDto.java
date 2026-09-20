package com.skillswap.dto;

import com.skillswap.model.ProficiencyLevel;
import com.skillswap.model.SkillType;
import com.skillswap.model.UserSkill;

public class UserSkillDto {
    private Long id;
    private Long userId;
    private SkillDto skill;
    private SkillType type;
    private ProficiencyLevel proficiencyLevel;

    public UserSkillDto() {}

    public UserSkillDto(Long id, Long userId, SkillDto skill, SkillType type, ProficiencyLevel proficiencyLevel) {
        this.id = id;
        this.userId = userId;
        this.skill = skill;
        this.type = type;
        this.proficiencyLevel = proficiencyLevel;
    }

    public static UserSkillDto fromEntity(UserSkill userSkill) {
        return new UserSkillDto(
                userSkill.getId(),
                userSkill.getUser().getId(),
                SkillDto.fromEntity(userSkill.getSkill()),
                userSkill.getType(),
                userSkill.getProficiencyLevel()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public SkillDto getSkill() { return skill; }
    public void setSkill(SkillDto skill) { this.skill = skill; }

    public SkillType getType() { return type; }
    public void setType(SkillType type) { this.type = type; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
}
