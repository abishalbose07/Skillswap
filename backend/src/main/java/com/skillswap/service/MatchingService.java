package com.skillswap.service;

import com.skillswap.dto.MatchDto;
import com.skillswap.dto.SkillDto;
import com.skillswap.dto.UserDto;
import com.skillswap.model.*;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;

    public MatchingService(UserRepository userRepository, UserSkillRepository userSkillRepository) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
    }

    public List<MatchDto> findMatchesForUser(String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        List<UserSkill> myUserSkills = userSkillRepository.findByUserId(currentUser.getId());
        
        List<UserSkill> myTeachUserSkills = myUserSkills.stream()
                .filter(us -> us.getType() == SkillType.TEACH)
                .collect(Collectors.toList());

        List<UserSkill> myLearnUserSkills = myUserSkills.stream()
                .filter(us -> us.getType() == SkillType.LEARN)
                .collect(Collectors.toList());

        List<User> allUsers = userRepository.findAll();
        List<MatchDto> matches = new ArrayList<>();

        for (User candidate : allUsers) {
            // Rule: Never return the current user as a match
            if (candidate.getId().equals(currentUser.getId())) {
                continue;
            }

            List<UserSkill> candidateUserSkills = userSkillRepository.findByUserId(candidate.getId());
            
            List<UserSkill> candidateTeachUserSkills = candidateUserSkills.stream()
                    .filter(us -> us.getType() == SkillType.TEACH)
                    .collect(Collectors.toList());

            List<UserSkill> candidateLearnUserSkills = candidateUserSkills.stream()
                    .filter(us -> us.getType() == SkillType.LEARN)
                    .collect(Collectors.toList());

            // 1. What candidate can teach that current user wants to learn
            List<SkillDto> theyCanTeachYou = new ArrayList<>();
            for (UserSkill cTeach : candidateTeachUserSkills) {
                for (UserSkill mLearn : myLearnUserSkills) {
                    if (isSkillMatch(cTeach.getSkill(), mLearn.getSkill())) {
                        theyCanTeachYou.add(SkillDto.fromEntity(cTeach.getSkill()));
                        break;
                    }
                }
            }

            // 2. What current user can teach that candidate wants to learn
            List<SkillDto> youCanTeachThem = new ArrayList<>();
            for (UserSkill mTeach : myTeachUserSkills) {
                for (UserSkill cLearn : candidateLearnUserSkills) {
                    if (isSkillMatch(mTeach.getSkill(), cLearn.getSkill())) {
                        youCanTeachThem.add(SkillDto.fromEntity(mTeach.getSkill()));
                        break;
                    }
                }
            }

            List<SkillDto> skillsTheyCanTeach = candidateTeachUserSkills.stream()
                    .map(us -> SkillDto.fromEntity(us.getSkill()))
                    .collect(Collectors.toList());

            List<SkillDto> skillsTheyWantToLearn = candidateLearnUserSkills.stream()
                    .map(us -> SkillDto.fromEntity(us.getSkill()))
                    .collect(Collectors.toList());

            // 3. Calculate Deterministic Compatibility Score (0–100)
            int score = calculateDeterministicScore(theyCanTeachYou, youCanTeachThem, candidateTeachUserSkills);

            // 4. Generate Human-Readable Explanation
            String explanation = generateExplanation(theyCanTeachYou, youCanTeachThem, candidate.getName());

            MatchDto match = new MatchDto(
                    UserDto.fromEntity(candidate),
                    score,
                    skillsTheyCanTeach,
                    skillsTheyWantToLearn,
                    youCanTeachThem,
                    theyCanTeachYou,
                    explanation
            );

            matches.add(match);
        }

        // Rule: Sort matches by compatibility score descending
        matches.sort((a, b) -> Integer.compare(b.getCompatibilityScore(), a.getCompatibilityScore()));

        return matches;
    }

    private boolean isSkillMatch(Skill s1, Skill s2) {
        if (s1.getId() != null && s2.getId() != null && s1.getId().equals(s2.getId())) {
            return true;
        }
        return s1.getName().equalsIgnoreCase(s2.getName());
    }

    private int calculateDeterministicScore(List<SkillDto> theyCanTeachYou,
                                           List<SkillDto> youCanTeachThem,
                                           List<UserSkill> candidateTeachUserSkills) {
        int reciprocalCount = Math.min(theyCanTeachYou.size(), youCanTeachThem.size());
        boolean isReciprocal = reciprocalCount > 0;

        int score = 0;

        if (isReciprocal) {
            // Reciprocal skill match: 40 base + 10 for each additional pair (up to max 60)
            int reciprocalScore = 40 + Math.min(20, (reciprocalCount - 1) * 10);
            
            // Add extra points for remaining one-way matches
            int extraOneWay = Math.abs(theyCanTeachYou.size() - youCanTeachThem.size());
            int oneWayScore = Math.min(20, extraOneWay * 10);
            
            score = reciprocalScore + oneWayScore; // Up to 60 points
        } else if (theyCanTeachYou.size() > 0 || youCanTeachThem.size() > 0) {
            // One-way skill match: up to 30 points
            int totalOneWay = theyCanTeachYou.size() + youCanTeachThem.size();
            score = Math.min(30, totalOneWay * 15);
        }

        // Proficiency & level bonus (up to 10 points)
        int proficiencyBonus = 0;
        for (UserSkill us : candidateTeachUserSkills) {
            if (us.getProficiencyLevel() == ProficiencyLevel.EXPERT) {
                proficiencyBonus += 5;
            } else if (us.getProficiencyLevel() == ProficiencyLevel.ADVANCED) {
                proficiencyBonus += 3;
            }
        }
        proficiencyBonus = Math.min(10, proficiencyBonus);

        score += proficiencyBonus;

        // Base presence bonus if candidate has active teaching skills
        if (score > 0 && candidateTeachUserSkills.size() > 0) {
            score = Math.min(100, score + 10);
        }

        return Math.min(100, Math.max(0, score));
    }

    private String generateExplanation(List<SkillDto> theyCanTeachYou, List<SkillDto> youCanTeachThem, String candidateName) {
        String name = candidateName != null ? candidateName : "They";

        String teachNames = youCanTeachThem.stream().map(SkillDto::getName).collect(Collectors.joining(", "));
        String learnNames = theyCanTeachYou.stream().map(SkillDto::getName).collect(Collectors.joining(", "));

        if (!youCanTeachThem.isEmpty() && !theyCanTeachYou.isEmpty()) {
            return "You can teach " + teachNames + ", which " + name + " wants to learn, while " + name + " can teach " + learnNames + ", which you want to learn.";
        } else if (!theyCanTeachYou.isEmpty()) {
            return name + " can teach " + learnNames + ", which matches your learning goals.";
        } else if (!youCanTeachThem.isEmpty()) {
            return "You can teach " + teachNames + ", which matches " + name + "'s learning goals.";
        } else {
            return "No direct skill overlap yet. Add more skills to unlock reciprocal matches!";
        }
    }
}
