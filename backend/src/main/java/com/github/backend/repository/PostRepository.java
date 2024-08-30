package com.github.backend.repository;

import com.github.backend.model.Post;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Post> findById(Integer id);
    List<Post> findByBoardId(Integer boardId);
}
