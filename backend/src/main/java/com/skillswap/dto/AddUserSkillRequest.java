package com.skillswap.dto;

import com.skillswap.model.ProficiencyLevel;
import com.skillswap.model.SkillType;

public class AddUserSkillRequest {
    private Long skillId;
    private String skillName;
    private String category;
    private SkillType type;
    private ProficiencyLevel proficiencyLevel;

    public AddUserSkillRequest() {}

    public AddUserSkillRequest(Long skillId, String skillName, String category, SkillType type, ProficiencyLevel proficiencyLevel) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.type = type;
        this.proficiencyLevel = proficiencyLevel;
    }

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public SkillType getType() { return type; }
    public void setType(SkillType type) { this.type = type; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
}
