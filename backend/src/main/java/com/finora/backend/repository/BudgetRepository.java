package com.finora.backend.repository;

import com.finora.backend.entity.BudgetEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<BudgetEntity, String> {
    List<BudgetEntity> findAllByUserId(String userId);
    void deleteAllByUserId(String userId);
}
