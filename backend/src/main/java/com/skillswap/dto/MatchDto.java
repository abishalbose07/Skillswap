package com.skillswap.dto;

import java.util.List;

public class MatchDto {
    private UserDto user;
    private int compatibilityScore;
    private List<SkillDto> skillsTheyCanTeach;
    private List<SkillDto> skillsTheyWantToLearn;
    private List<SkillDto> skillsYouCanTeachThem;
    private List<SkillDto> skillsYouWantToLearnFromThem;
    private String explanation;

    public MatchDto() {}

    public MatchDto(UserDto user, int compatibilityScore, List<SkillDto> skillsTheyCanTeach, List<SkillDto> skillsTheyWantToLearn, List<SkillDto> skillsYouCanTeachThem, List<SkillDto> skillsYouWantToLearnFromThem, String explanation) {
        this.user = user;
        this.compatibilityScore = compatibilityScore;
        this.skillsTheyCanTeach = skillsTheyCanTeach;
        this.skillsTheyWantToLearn = skillsTheyWantToLearn;
        this.skillsYouCanTeachThem = skillsYouCanTeachThem;
        this.skillsYouWantToLearnFromThem = skillsYouWantToLearnFromThem;
        this.explanation = explanation;
    }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public int getCompatibilityScore() { return compatibilityScore; }
    public void setCompatibilityScore(int compatibilityScore) { this.compatibilityScore = compatibilityScore; }

    public List<SkillDto> getSkillsTheyCanTeach() { return skillsTheyCanTeach; }
    public void setSkillsTheyCanTeach(List<SkillDto> skillsTheyCanTeach) { this.skillsTheyCanTeach = skillsTheyCanTeach; }

    public List<SkillDto> getSkillsTheyWantToLearn() { return skillsTheyWantToLearn; }
    public void setSkillsTheyWantToLearn(List<SkillDto> skillsTheyWantToLearn) { this.skillsTheyWantToLearn = skillsTheyWantToLearn; }

    public List<SkillDto> getSkillsYouCanTeachThem() { return skillsYouCanTeachThem; }
    public void setSkillsYouCanTeachThem(List<SkillDto> skillsYouCanTeachThem) { this.skillsYouCanTeachThem = skillsYouCanTeachThem; }

    public List<SkillDto> getSkillsYouWantToLearnFromThem() { return skillsYouWantToLearnFromThem; }
    public void setSkillsYouWantToLearnFromThem(List<SkillDto> skillsYouWantToLearnFromThem) { this.skillsYouWantToLearnFromThem = skillsYouWantToLearnFromThem; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
