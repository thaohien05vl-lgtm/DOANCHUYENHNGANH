package com.finora.backend.repository;

import com.finora.backend.entity.GoalEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<GoalEntity, String> {
    List<GoalEntity> findAllByUserId(String userId);
    void deleteAllByUserId(String userId);
}
