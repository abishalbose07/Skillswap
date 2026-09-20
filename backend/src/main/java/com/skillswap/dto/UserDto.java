package com.skillswap.dto;

import com.skillswap.model.User;
import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String name;
    private String fullName;
    private String email;
    private String bio;
    private String college;
    private String course;
    private String yearOfStudy;
    private String profileImage;
    private String skillsOffered;
    private String skillsNeeded;
    private String role;
    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(Long id, String name, String fullName, String email, String bio, String college, String course, String yearOfStudy, String profileImage, String skillsOffered, String skillsNeeded, String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.fullName = fullName != null ? fullName : name;
        this.email = email;
        this.bio = bio;
        this.college = college;
        this.course = course;
        this.yearOfStudy = yearOfStudy;
        this.profileImage = profileImage;
        this.skillsOffered = skillsOffered;
        this.skillsNeeded = skillsNeeded;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getName(),
                user.getEmail(),
                user.getBio(),
                user.getCollege(),
                user.getCourse(),
                user.getYearOfStudy(),
                user.getProfileImage(),
                user.getSkillsOffered(),
                user.getSkillsNeeded(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; this.fullName = name; }

    public String getFullName() { return fullName != null ? fullName : name; }
    public void setFullName(String fullName) { this.fullName = fullName; this.name = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public String getSkillsOffered() { return skillsOffered; }
    public void setSkillsOffered(String skillsOffered) { this.skillsOffered = skillsOffered; }

    public String getSkillsNeeded() { return skillsNeeded; }
    public void setSkillsNeeded(String skillsNeeded) { this.skillsNeeded = skillsNeeded; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
