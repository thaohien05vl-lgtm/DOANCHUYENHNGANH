package com.finora.backend.repository;

import com.finora.backend.entity.NotificationEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<NotificationEntity, String> {
    List<NotificationEntity> findAllByUserIdOrderByCreatedAtDesc(String userId);
    Optional<NotificationEntity> findByIdAndUserId(String id, String userId);
    long countByUserIdAndReadFalse(String userId);
    boolean existsByUserIdAndTransactionId(String userId, String transactionId);
    boolean existsByUserIdAndTypeAndTitle(String userId, String type, String title);

    @Modifying
    @Query("UPDATE NotificationEntity n SET n.read = true WHERE n.userId = :userId AND n.read = false")
    int markAllAsRead(@Param("userId") String userId);

    void deleteAllByUserId(String userId);
}

