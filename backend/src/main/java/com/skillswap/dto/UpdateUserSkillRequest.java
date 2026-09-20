package com.skillswap.dto;

import com.skillswap.model.ProficiencyLevel;

public class UpdateUserSkillRequest {
    private ProficiencyLevel proficiencyLevel;

    public UpdateUserSkillRequest() {}

    public UpdateUserSkillRequest(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
}
