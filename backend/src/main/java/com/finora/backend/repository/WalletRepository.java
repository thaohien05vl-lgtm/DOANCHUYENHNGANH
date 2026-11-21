package com.finora.backend.repository;

import com.finora.backend.entity.WalletEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<WalletEntity, String> {
    List<WalletEntity> findAllByUserId(String userId);
    void deleteAllByUserId(String userId);
}
