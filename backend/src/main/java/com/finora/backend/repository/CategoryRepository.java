package com.finora.backend.repository;

import com.finora.backend.entity.CategoryEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<CategoryEntity, String> {
    List<CategoryEntity> findAllByUserId(String userId);
    void deleteAllByUserId(String userId);
}
