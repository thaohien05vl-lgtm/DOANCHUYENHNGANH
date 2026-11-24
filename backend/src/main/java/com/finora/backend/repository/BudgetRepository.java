package com.finora.backend.repository;

import com.finora.backend.entity.BudgetEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<BudgetEntity, String> {
    List<BudgetEntity> findAllByUserId(String userId);
    List<BudgetEntity> findAllByUserIdAndKyNganSach(String userId, String kyNganSach);
    List<BudgetEntity> findAllByUserIdAndThangAndNam(String userId, Integer thang, Integer nam);
    void deleteAllByUserId(String userId);
}
