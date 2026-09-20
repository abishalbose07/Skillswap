package com.skillswap.repository;

import com.skillswap.model.SkillSwap;
import com.skillswap.model.SwapStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillSwapRepository extends JpaRepository<SkillSwap, Long> {

    @Query("SELECT s FROM SkillSwap s WHERE s.userOne.id = :userId OR s.userTwo.id = :userId ORDER BY s.createdAt DESC")
    List<SkillSwap> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(s) > 0 FROM SkillSwap s WHERE " +
           "((s.userOne.id = :u1 AND s.userTwo.id = :u2) OR (s.userOne.id = :u2 AND s.userTwo.id = :u1)) " +
           "AND s.status = :status")
    Boolean existsBetweenUsersAndStatus(@Param("u1") Long u1, @Param("u2") Long u2, @Param("status") SwapStatus status);
}
