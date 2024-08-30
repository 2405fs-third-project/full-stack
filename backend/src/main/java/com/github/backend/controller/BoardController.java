package com.github.backend.controller;

import com.github.backend.model.Board;
import com.github.backend.model.Post;
import com.github.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/board")
public class BoardController {

    private final PostService postService;

    @GetMapping("/{boardId}")
    public ResponseEntity<List<Post>> getPostsByBoardId(@PathVariable Integer boardId) {
        List<Post> posts = postService.getPostByBoardId(boardId);
        return ResponseEntity.ok(posts);
    }

}
