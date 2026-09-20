package com.skillswap.service;

import com.skillswap.dto.SkillSwapResponseDto;
import com.skillswap.model.SkillSwap;
import com.skillswap.model.SwapStatus;
import com.skillswap.model.User;
import com.skillswap.repository.SkillSwapRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillSwapService {

    private final SkillSwapRepository skillSwapRepository;
    private final UserRepository userRepository;

    public SkillSwapService(SkillSwapRepository skillSwapRepository, UserRepository userRepository) {
        this.skillSwapRepository = skillSwapRepository;
        this.userRepository = userRepository;
    }

    public List<SkillSwapResponseDto> getUserSwaps(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return skillSwapRepository.findByUserId(user.getId()).stream()
                .map(SkillSwapResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public SkillSwapResponseDto getSwapById(String email, Long swapId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        SkillSwap swap = skillSwapRepository.findById(swapId)
                .orElseThrow(() -> new IllegalArgumentException("Skill swap not found with ID: " + swapId));

        if (!swap.getUserOne().getId().equals(user.getId()) && !swap.getUserTwo().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized: You are not a participant in this skill swap");
        }

        return SkillSwapResponseDto.fromEntity(swap);
    }

    @Transactional
    public SkillSwapResponseDto completeSwap(String email, Long swapId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        SkillSwap swap = skillSwapRepository.findById(swapId)
                .orElseThrow(() -> new IllegalArgumentException("Skill swap not found with ID: " + swapId));

        if (!swap.getUserOne().getId().equals(user.getId()) && !swap.getUserTwo().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized: Only swap participants can complete a swap");
        }

        swap.setStatus(SwapStatus.COMPLETED);
        swap.setCompletedAt(LocalDateTime.now());
        SkillSwap updated = skillSwapRepository.save(swap);
        return SkillSwapResponseDto.fromEntity(updated);
    }

    @Transactional
    public SkillSwapResponseDto cancelSwap(String email, Long swapId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        SkillSwap swap = skillSwapRepository.findById(swapId)
                .orElseThrow(() -> new IllegalArgumentException("Skill swap not found with ID: " + swapId));

        if (!swap.getUserOne().getId().equals(user.getId()) && !swap.getUserTwo().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized: Only swap participants can cancel a swap");
        }

        swap.setStatus(SwapStatus.CANCELLED);
        SkillSwap updated = skillSwapRepository.save(swap);
        return SkillSwapResponseDto.fromEntity(updated);
    }
}
