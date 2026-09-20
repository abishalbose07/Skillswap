package com.skillswap.service;

import com.skillswap.dto.*;
import com.skillswap.model.*;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SkillService(SkillRepository skillRepository,
                        UserSkillRepository userSkillRepository,
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void seedDefaultSkillsAndUsers() {
        if (skillRepository.count() == 0) {
            List<Skill> defaultSkills = Arrays.asList(
                    new Skill("React", "Frontend Development", "Modern component-based UI library"),
                    new Skill("Java", "Backend Development", "Object-oriented programming language"),
                    new Skill("Spring Boot", "Backend Development", "Enterprise Java framework"),
                    new Skill("Python", "Data Science & AI", "Versatile programming language"),
                    new Skill("UI/UX Design", "Design", "User interface & user experience prototyping"),
                    new Skill("Figma", "Design", "Interface design & collaborative vector tool"),
                    new Skill("Docker", "DevOps & Cloud", "Containerization technology"),
                    new Skill("Node.js", "Backend Development", "JavaScript server runtime"),
                    new Skill("SQL & Databases", "Database", "Relational database management"),
                    new Skill("Public Speaking", "Soft Skills", "Communication and presentation skills"),
                    new Skill("Spanish Language", "Languages", "Conversational and fluent Spanish"),
                    new Skill("Graphic Design", "Design", "Visual branding and illustration")
            );
            skillRepository.saveAll(defaultSkills);
        }

        // Seed demo users with reciprocal skills if none exist
        if (!userRepository.existsByEmail("arun@skillswap.com")) {
            User arun = userRepository.save(User.builder()
                    .name("Arun Kumar")
                    .email("arun@skillswap.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .college("IIT Bombay")
                    .course("Computer Science")
                    .yearOfStudy("3rd Year (Junior)")
                    .bio("Java Backend developer looking to learn Python and Data Science.")
                    .profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400")
                    .build());

            User priya = userRepository.save(User.builder()
                    .name("Priya Sharma")
                    .email("priya@skillswap.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .college("NIFT Delhi")
                    .course("UI/UX & Product Design")
                    .yearOfStudy("4th Year (Senior)")
                    .bio("Design enthusiast seeking to exchange Figma and UI skills for React development.")
                    .profileImage("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400")
                    .build());

            User carlos = userRepository.save(User.builder()
                    .name("Carlos Mendez")
                    .email("carlos@skillswap.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .college("Barcelona Tech")
                    .course("Data Analytics")
                    .yearOfStudy("Postgraduate")
                    .bio("Python & Data Science developer eager to learn Java & Spring Boot.")
                    .profileImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400")
                    .build());

            Skill java = skillRepository.findByNameIgnoreCase("Java").orElse(null);
            Skill spring = skillRepository.findByNameIgnoreCase("Spring Boot").orElse(null);
            Skill python = skillRepository.findByNameIgnoreCase("Python").orElse(null);
            Skill react = skillRepository.findByNameIgnoreCase("React").orElse(null);
            Skill uiux = skillRepository.findByNameIgnoreCase("UI/UX Design").orElse(null);
            Skill figma = skillRepository.findByNameIgnoreCase("Figma").orElse(null);

            if (java != null && python != null && arun != null && carlos != null) {
                // Arun: TEACH Java, LEARN Python
                userSkillRepository.save(new UserSkill(arun, java, SkillType.TEACH, ProficiencyLevel.EXPERT));
                userSkillRepository.save(new UserSkill(arun, python, SkillType.LEARN, ProficiencyLevel.BEGINNER));

                // Carlos: TEACH Python, LEARN Java (Perfect Reciprocal Match with Arun!)
                userSkillRepository.save(new UserSkill(carlos, python, SkillType.TEACH, ProficiencyLevel.EXPERT));
                userSkillRepository.save(new UserSkill(carlos, java, SkillType.LEARN, ProficiencyLevel.BEGINNER));
            }

            if (react != null && uiux != null && figma != null && priya != null) {
                // Priya: TEACH UI/UX & Figma, LEARN React
                userSkillRepository.save(new UserSkill(priya, uiux, SkillType.TEACH, ProficiencyLevel.EXPERT));
                userSkillRepository.save(new UserSkill(priya, figma, SkillType.TEACH, ProficiencyLevel.ADVANCED));
                userSkillRepository.save(new UserSkill(priya, react, SkillType.LEARN, ProficiencyLevel.BEGINNER));
            }
        }
    }

    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(SkillDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UserSkillDto> getUserSkillsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        return userSkillRepository.findByUserId(user.getId()).stream()
                .map(UserSkillDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<UserSkillDto> getUserSkillsByUserId(Long userId) {
        return userSkillRepository.findByUserId(userId).stream()
                .map(UserSkillDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserSkillDto addUserSkill(String email, AddUserSkillRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        if (request.getType() == null) {
            throw new IllegalArgumentException("Skill type (TEACH or LEARN) is required");
        }
        if (request.getProficiencyLevel() == null) {
            throw new IllegalArgumentException("Proficiency level is required");
        }

        Skill skill;
        if (request.getSkillId() != null) {
            skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new IllegalArgumentException("Skill not found with ID: " + request.getSkillId()));
        } else if (request.getSkillName() != null && !request.getSkillName().trim().isEmpty()) {
            String name = request.getSkillName().trim();
            skill = skillRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> {
                        String category = request.getCategory() != null ? request.getCategory() : "General";
                        return skillRepository.save(new Skill(name, category, "Custom user skill"));
                    });
        } else {
            throw new IllegalArgumentException("Either skillId or skillName must be provided");
        }

        if (userSkillRepository.existsByUserIdAndSkillIdAndType(user.getId(), skill.getId(), request.getType())) {
            throw new IllegalArgumentException("You have already added '" + skill.getName() + "' to your " + request.getType() + " skills list");
        }

        UserSkill userSkill = new UserSkill(user, skill, request.getType(), request.getProficiencyLevel());
        UserSkill savedUserSkill = userSkillRepository.save(userSkill);
        return UserSkillDto.fromEntity(savedUserSkill);
    }

    @Transactional
    public UserSkillDto updateUserSkill(String email, Long userSkillId, UpdateUserSkillRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        UserSkill userSkill = userSkillRepository.findById(userSkillId)
                .orElseThrow(() -> new IllegalArgumentException("User skill not found with ID: " + userSkillId));

        if (!userSkill.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized: You cannot modify another user's skill");
        }

        if (request.getProficiencyLevel() != null) {
            userSkill.setProficiencyLevel(request.getProficiencyLevel());
        }

        UserSkill updated = userSkillRepository.save(userSkill);
        return UserSkillDto.fromEntity(updated);
    }

    @Transactional
    public void deleteUserSkill(String email, Long userSkillId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        UserSkill userSkill = userSkillRepository.findById(userSkillId)
                .orElseThrow(() -> new IllegalArgumentException("User skill not found with ID: " + userSkillId));

        if (!userSkill.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized: You cannot delete another user's skill");
        }

        userSkillRepository.delete(userSkill);
    }
}
