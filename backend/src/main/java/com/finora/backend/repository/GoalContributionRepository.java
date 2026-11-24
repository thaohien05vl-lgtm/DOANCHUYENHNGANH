package com.finora.backend.repository;

import com.finora.backend.entity.GoalContributionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalContributionRepository extends JpaRepository<GoalContributionEntity, String> {
    List<GoalContributionEntity> findAllByUserIdAndGoalIdOrderByCreatedAtDesc(String userId, String goalId);
    List<GoalContributionEntity> findAllByUserIdOrderByCreatedAtDesc(String userId);
}
