package com.finora.backend.repository;

import com.finora.backend.entity.TransactionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionEntity, String> {
    List<TransactionEntity> findAllByUserId(String userId);
    void deleteAllByUserId(String userId);
}
