package com.github.backend.service;

import com.github.backend.dto.AddPostRequest;
import com.github.backend.dto.PostResponse;
import com.github.backend.model.Board;
import com.github.backend.model.Post;
import com.github.backend.model.User;
import com.github.backend.repository.BoardRepository;
import com.github.backend.repository.PostRepository;
import com.github.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserService userService;


    @Transactional // 게시글 작성 : 낙관적
    public Post createPost(AddPostRequest addPostRequest) {
        // 요청에서 boardId를 동적으로 받아서 해당 게시판을 조회
        Board board = boardRepository.findById(addPostRequest.getBoardId())
                .orElseThrow(() -> new RuntimeException("Board not found"));

        User user = userRepository.findById(addPostRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer postpt = user.getPoint() + 10;
        String userId = user.getUserId();
        userService.updateUserRole(postpt, userId);

        Post post = new Post();
        post.setBoard(board); // 동적으로 조회한 게시판을 설정
        post.setUser(user); // 중복 호출 제거
        post.setPostNumber(addPostRequest.getPostNumber());
        post.setPostName(addPostRequest.getPostName());
        post.setPostContent(addPostRequest.getPostContent());
        post.setViews(addPostRequest.getViews());
        post.setLikes(addPostRequest.getLikes());
        post.setType(addPostRequest.getType());
        post.setPostCreate(LocalDateTime.now());

        try {
            return postRepository.save(post);
        } catch (OptimisticLockingFailureException e) {
            log.error("Optimistic locking failure while creating post: {}", e.getMessage());
            throw new RuntimeException("Failed to create post due to optimistic locking", e);
        }
    }

    @Transactional //게시글 확인
    public Optional<PostResponse> getPostById(Integer id) {
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
                post.getUser().getNickname(),
                post.getType()
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
                post.getUser().getNickname(),
                post.getType()
        ));
    }

    @Transactional // 게시글 삭제 : 비관적
    public void deletePost(Integer id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = post.getUser();

        if (user.getPoint() >= 10) {
            user.setPoint(user.getPoint() - 10);
        } else {
            user.setPoint(0);
        }

        userRepository.save(user);
        postRepository.delete(post);
    }

    @Transactional //좋아요 증가 : 비관적
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
                post.getUser().getNickname(),
                post.getType()
        ));
    }

    @Transactional(readOnly = true) // 게시글 목록 조회
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll();

        return posts.stream()
                .map(post -> new PostResponse(
                        post.getUser().getId(),
                        post.getPostNumber(),
                        post.getPostName(),
                        post.getPostContent(),
                        post.getViews(),
                        post.getLikes(),
                        post.getPostCreate(),
                        post.getUser().getNickname(),
                        post.getType()
                ))
                .collect(Collectors.toList());
    }
}
