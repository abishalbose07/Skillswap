package com.skillswap.repository;

import com.skillswap.model.UserSkill;
import com.skillswap.model.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    List<UserSkill> findByUserIdAndType(Long userId, SkillType type);
    Boolean existsByUserIdAndSkillIdAndType(Long userId, Long skillId, SkillType type);
    Boolean existsByUserIdAndSkillNameIgnoreCaseAndType(Long userId, String skillName, SkillType type);
}
