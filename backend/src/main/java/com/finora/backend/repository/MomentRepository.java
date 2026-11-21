package com.finora.backend.repository;

import com.finora.backend.entity.MomentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MomentRepository extends JpaRepository<MomentEntity, String> {
    List<MomentEntity> findAllByUserId(String userId);
    void deleteAllByUserId(String userId);
}
