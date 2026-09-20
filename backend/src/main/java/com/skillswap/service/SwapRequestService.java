package com.skillswap.service;

import com.skillswap.dto.CreateSwapRequestDto;
import com.skillswap.dto.SwapRequestResponseDto;
import com.skillswap.model.*;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.SkillSwapRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.SwapRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;
    private final SkillSwapRepository skillSwapRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public SwapRequestService(SwapRequestRepository swapRequestRepository,
                              SkillSwapRepository skillSwapRepository,
                              UserRepository userRepository,
                              SkillRepository skillRepository) {
        this.swapRequestRepository = swapRequestRepository;
        this.skillSwapRepository = skillSwapRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public SwapRequestResponseDto createSwapRequest(String senderEmail, CreateSwapRequestDto dto) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new IllegalArgumentException("Sender user not found: " + senderEmail));

        if (dto.getReceiverId() == null) {
            throw new IllegalArgumentException("Receiver ID is required");
        }
        if (sender.getId().equals(dto.getReceiverId())) {
            throw new IllegalArgumentException("Sender cannot send a swap request to themselves");
        }

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found with ID: " + dto.getReceiverId()));

        if (dto.getOfferedSkillId() == null || dto.getRequestedSkillId() == null) {
            throw new IllegalArgumentException("Offered skill ID and requested skill ID are required");
        }

        Skill offeredSkill = skillRepository.findById(dto.getOfferedSkillId())
                .orElseThrow(() -> new IllegalArgumentException("Offered skill not found with ID: " + dto.getOfferedSkillId()));

        Skill requestedSkill = skillRepository.findById(dto.getRequestedSkillId())
                .orElseThrow(() -> new IllegalArgumentException("Requested skill not found with ID: " + dto.getRequestedSkillId()));

        // Rule: Prevent duplicate pending requests
        if (swapRequestRepository.existsBySenderIdAndReceiverIdAndStatus(
                sender.getId(), receiver.getId(), SwapRequestStatus.PENDING)) {
            throw new IllegalArgumentException("You already have a pending request with this user.");
        }

        SwapRequest request = new SwapRequest(
                sender,
                receiver,
                offeredSkill,
                requestedSkill,
                dto.getMessage(),
                SwapRequestStatus.PENDING
        );

        SwapRequest saved = swapRequestRepository.save(request);
        return SwapRequestResponseDto.fromEntity(saved);
    }

    public List<SwapRequestResponseDto> getSentRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return swapRequestRepository.findBySenderIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(SwapRequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<SwapRequestResponseDto> getReceivedRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return swapRequestRepository.findByReceiverIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(SwapRequestResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public SwapRequestResponseDto acceptSwapRequest(String email, Long requestId) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Swap request not found with ID: " + requestId));

        // Rule: Only the receiver can accept
        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new SecurityException("Unauthorized: Only the receiver can accept a swap request");
        }

        if (request.getStatus() != SwapRequestStatus.PENDING) {
            throw new IllegalArgumentException("Swap request is no longer PENDING (Current status: " + request.getStatus() + ")");
        }

        request.setStatus(SwapRequestStatus.ACCEPTED);
        SwapRequest updatedRequest = swapRequestRepository.save(request);

        // Automatically create an Active SkillSwap
        Boolean existsActive = skillSwapRepository.existsBetweenUsersAndStatus(
                request.getSender().getId(), request.getReceiver().getId(), SwapStatus.ACTIVE);

        if (!existsActive) {
            SkillSwap activeSwap = new SkillSwap(
                    request.getSender(),
                    request.getReceiver(),
                    request.getOfferedSkill(),
                    request.getRequestedSkill(),
                    SwapStatus.ACTIVE
            );
            skillSwapRepository.save(activeSwap);
        }

        return SwapRequestResponseDto.fromEntity(updatedRequest);
    }

    @Transactional
    public SwapRequestResponseDto rejectSwapRequest(String email, Long requestId) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Swap request not found with ID: " + requestId));

        // Rule: Only the receiver can reject
        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new SecurityException("Unauthorized: Only the receiver can reject a swap request");
        }

        request.setStatus(SwapRequestStatus.REJECTED);
        SwapRequest updatedRequest = swapRequestRepository.save(request);
        return SwapRequestResponseDto.fromEntity(updatedRequest);
    }

    @Transactional
    public SwapRequestResponseDto cancelSwapRequest(String email, Long requestId) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Swap request not found with ID: " + requestId));

        // Rule: Only the sender can cancel a pending request
        if (!request.getSender().getId().equals(currentUser.getId())) {
            throw new SecurityException("Unauthorized: Only the sender can cancel a swap request");
        }

        request.setStatus(SwapRequestStatus.CANCELLED);
        SwapRequest updatedRequest = swapRequestRepository.save(request);
        return SwapRequestResponseDto.fromEntity(updatedRequest);
    }
}
