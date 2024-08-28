package com.github.backend.repository;

import com.github.backend.model.Reply;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Reply r WHERE r.id = :id")
    Optional<Reply> findByIdWithLock(@Param("id") Integer id);
    List<Reply> findByPostId(Integer postId);

}
