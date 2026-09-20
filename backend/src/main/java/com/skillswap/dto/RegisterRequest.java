package com.skillswap.dto;

public class RegisterRequest {
    private String name;
    private String fullName; // alias for name (frontend may send either)
    private String email;
    private String password;
    private String bio;
    private String skillsOffered;
    private String skillsNeeded;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String bio, String skillsOffered, String skillsNeeded) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.skillsOffered = skillsOffered;
        this.skillsNeeded = skillsNeeded;
    }

    public String getName() { return name != null ? name : fullName; }
    public void setName(String name) { this.name = name; }

    public String getFullName() { return fullName != null ? fullName : name; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getSkillsOffered() { return skillsOffered; }
    public void setSkillsOffered(String skillsOffered) { this.skillsOffered = skillsOffered; }

    public String getSkillsNeeded() { return skillsNeeded; }
    public void setSkillsNeeded(String skillsNeeded) { this.skillsNeeded = skillsNeeded; }
}
