package com.github.backend.controller;

import com.github.backend.dto.AddPostRequest;
import com.github.backend.dto.PostResponse;
import com.github.backend.model.Post;
import com.github.backend.service.PostService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/posts")
public class PostController {

    private final PostService postService;

    //게시글 작성
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
                .map(response -> new ResponseEntity<>(response, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //게시글 수정
    @PutMapping("/modify/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Integer id,
            @RequestBody AddPostRequest updateRequest) {

        Optional<PostResponse> updatedPost = postService.updatePost(id, updateRequest);
        return updatedPost.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //게시글 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    //좋아요 수 증가
    @PostMapping("/{id}/like")
    public ResponseEntity<PostResponse> likePost(@PathVariable Integer id) {
        Optional<PostResponse> likedPost = postService.increaseLikes(id);
        return likedPost.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}