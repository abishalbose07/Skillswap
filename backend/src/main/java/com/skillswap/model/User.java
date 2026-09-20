package com.skillswap.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String college;
    private String course;
    private String yearOfStudy;
    private String profileImage;

    private String skillsOffered;
    private String skillsNeeded;

    private String role = "ROLE_USER";

    private LocalDateTime createdAt;

    public User() {}

    public User(Long id, String name, String email, String password, String bio, String college, String course, String yearOfStudy, String profileImage, String skillsOffered, String skillsNeeded, String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.college = college;
        this.course = course;
        this.yearOfStudy = yearOfStudy;
        this.profileImage = profileImage;
        this.skillsOffered = skillsOffered;
        this.skillsNeeded = skillsNeeded;
        this.role = role != null ? role : "ROLE_USER";
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.role == null) {
            this.role = "ROLE_USER";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

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

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private String bio;
        private String college;
        private String course;
        private String yearOfStudy;
        private String profileImage;
        private String skillsOffered;
        private String skillsNeeded;
        private String role = "ROLE_USER";
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder bio(String bio) { this.bio = bio; return this; }
        public UserBuilder college(String college) { this.college = college; return this; }
        public UserBuilder course(String course) { this.course = course; return this; }
        public UserBuilder yearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; return this; }
        public UserBuilder profileImage(String profileImage) { this.profileImage = profileImage; return this; }
        public UserBuilder skillsOffered(String skillsOffered) { this.skillsOffered = skillsOffered; return this; }
        public UserBuilder skillsNeeded(String skillsNeeded) { this.skillsNeeded = skillsNeeded; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, name, email, password, bio, college, course, yearOfStudy, profileImage, skillsOffered, skillsNeeded, role, createdAt);
        }
    }
}
