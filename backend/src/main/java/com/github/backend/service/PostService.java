package com.github.backend.service;

import com.github.backend.dto.AddPostRequest;
import com.github.backend.dto.PostResponse;
import com.github.backend.model.Board;
import com.github.backend.model.Post;
import com.github.backend.repository.BoardRepository;
import com.github.backend.repository.PostRepository;
import com.github.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;


    @Transactional //게시글 작성
    public Post createPost(AddPostRequest addPostRequest) {
        Board board = boardRepository.findById(1).orElseThrow(() -> new RuntimeException("Board not found"));

        Post post = new Post();
        post.setBoard(board);
        post.setUser(userRepository.findById(addPostRequest.getUserId()).orElseThrow(() -> new RuntimeException("User not found")));
        post.setPostNumber(addPostRequest.getPostNumber());
        post.setPostName(addPostRequest.getPostName());
        post.setPostContent(addPostRequest.getPostContent());
        post.setViews(addPostRequest.getViews());
        post.setLikes(addPostRequest.getLikes());
        post.setPostCreate(LocalDateTime.now());
        return postRepository.save(post);
    }

    @Transactional(readOnly = true) //게시글 확인
    public Optional<PostResponse> getPostById(Integer id) { // 게시글 확인
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setViews(post.getViews() + 1); // 조회수 증가
        postRepository.save(post); // 변경사항 저장

        return Optional.of(new PostResponse(
                post.getUser().getId(),
                post.getPostNumber(),
                post.getPostName(),
                post.getPostContent(),
                post.getViews(),
                post.getLikes(),
                post.getPostCreate(),
                post.getUser().getNickname()
        ));
    }

    @Transactional //게시글 수정
    public Optional<PostResponse> updatePost(Integer id, AddPostRequest addPostRequest) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));

        post.setPostName(addPostRequest.getPostName());
        post.setPostContent(addPostRequest.getPostContent());
        post.setPostCreate(LocalDateTime.now());

        postRepository.save(post);

        return Optional.of(new PostResponse(
                post.getUser().getId(),
                post.getPostNumber(),
                post.getPostName(),
                post.getPostContent(),
                post.getViews(),
                post.getLikes(),
                post.getPostCreate(),
                post.getUser().getNickname()
        ));
    }

    @Transactional //게시글 삭제
    public void deletePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        postRepository.delete(post);
    }

    @Transactional //좋아요 증가
    public Optional<PostResponse> increaseLikes(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));

        post.setLikes(post.getLikes() + 1); //좋아요 수 증가
        postRepository.save(post);

        return Optional.of(new PostResponse(
                post.getUser().getId(),
                post.getPostNumber(),
                post.getPostName(),
                post.getPostContent(),
                post.getViews(),
                post.getLikes(),
                post.getPostCreate(),
                post.getUser().getNickname()
        ));
    }
}
