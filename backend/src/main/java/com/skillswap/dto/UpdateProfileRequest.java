package com.skillswap.dto;

public class UpdateProfileRequest {
    private String fullName;
    private String name;
    private String college;
    private String course;
    private String yearOfStudy;
    private String bio;
    private String profileImage;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String fullName, String college, String course, String yearOfStudy, String bio, String profileImage) {
        this.fullName = fullName;
        this.name = fullName;
        this.college = college;
        this.course = course;
        this.yearOfStudy = yearOfStudy;
        this.bio = bio;
        this.profileImage = profileImage;
    }

    public String getFullName() { return fullName != null ? fullName : name; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getName() { return name != null ? name : fullName; }
    public void setName(String name) { this.name = name; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}
