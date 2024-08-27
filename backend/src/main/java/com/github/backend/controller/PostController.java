package com.github.backend.controller;

import com.github.backend.dto.AddPostRequest;
import com.github.backend.dto.PostResponse;
import com.github.backend.model.Post;
import com.github.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/posts")
public class PostController {

    private final PostService postService;

    // 게시글 작성
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody AddPostRequest addPostRequest) {
        Post post = postService.createPost(addPostRequest);
        return ResponseEntity.ok(post);
    }

    // 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Integer id) {
        Optional<PostResponse> postResponse = postService.getPostById(id);
        return postResponse
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 특정 게시판의 게시글 목록 조회
    @GetMapping
    public ResponseEntity<List<PostResponse>> getPostsByBoardId(@RequestParam("boardId") Integer boardId) {
        List<PostResponse> posts = postService.getPostsByBoardId(boardId);
        return ResponseEntity.ok(posts);
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Integer id,
            @RequestBody AddPostRequest updateRequest) {

        Optional<PostResponse> updatedPost = postService.updatePost(id, updateRequest);
        return updatedPost
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 좋아요 수 증가
    @PatchMapping("/{id}/like")
    public ResponseEntity<PostResponse> likePost(@PathVariable Integer id) {
        Optional<PostResponse> likedPost = postService.increaseLikes(id);
        return likedPost
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 조회수 증가
    @PatchMapping("/{id}/views")
    public ResponseEntity<PostResponse> incrementViews(@PathVariable Integer id) {
        Optional<PostResponse> updatedPost = postService.incrementViews(id);
        return updatedPost
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}