package com.github.backend.repository;

import com.github.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserId(String userId);
    Optional<User> findByNickname(String nickname);
}
