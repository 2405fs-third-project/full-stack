package com.github.backend.repository;

import com.github.backend.model.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserId(String userId);
    Optional<User> findByNickname(String nickname);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<User> findById(Integer userId);
}
