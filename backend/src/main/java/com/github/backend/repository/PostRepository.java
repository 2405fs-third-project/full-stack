package com.github.backend.repository;

import com.github.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; // 추가된 부분

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByBoardId(Integer boardId); // 추가된 메서드
}
