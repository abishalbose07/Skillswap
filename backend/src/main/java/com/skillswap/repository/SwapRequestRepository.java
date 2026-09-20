package com.skillswap.repository;

import com.skillswap.model.SwapRequest;
import com.skillswap.model.SwapRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
    List<SwapRequest> findBySenderIdOrderByCreatedAtDesc(Long senderId);
    List<SwapRequest> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);

    Boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, SwapRequestStatus status);
    Boolean existsBySenderIdAndReceiverIdAndOfferedSkillIdAndRequestedSkillIdAndStatus(
            Long senderId, Long receiverId, Long offeredSkillId, Long requestedSkillId, SwapRequestStatus status
    );
}
