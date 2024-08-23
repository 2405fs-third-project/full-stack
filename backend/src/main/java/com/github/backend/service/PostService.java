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
        // 요청에서 boardId를 동적으로 받아서 해당 게시판을 조회
        Board board = boardRepository.findById(addPostRequest.getBoardId())
                .orElseThrow(() -> new RuntimeException("Board not found"));

        User user = userRepository.findById(addPostRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPoint(user.getPoint() + 10);
        userRepository.save(user); // 업데이트된 포인트 정보 저장

        Post post = new Post();
        post.setBoard(board); // 동적으로 조회한 게시판을 설정
        post.setUser(userRepository.findById(addPostRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
        post.setPostNumber(addPostRequest.getPostNumber());
        post.setPostName(addPostRequest.getPostName());
        post.setPostContent(addPostRequest.getPostContent());
        post.setViews(addPostRequest.getViews());
        post.setLikes(addPostRequest.getLikes());
        post.setType(addPostRequest.getType());
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

    @Transactional // 게시글 삭제
    public void deletePost(Integer id) {
        // 게시글 조회
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 사용자 조회
        User user = post.getUser();

        // 포인트 10점 감점 (포인트가 0보다 작아지지 않도록 조건 처리)
        if (user.getPoint() >= 10) {
            user.setPoint(user.getPoint() - 10);
        } else {
            user.setPoint(0); // 포인트가 0보다 작아질 경우 0으로 설정
        }

        userRepository.save(user); // 업데이트된 포인트 정보 저장

        // 게시글 삭제
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
                post.getUser().getNickname(),
                post.getType()
        ));
    }
}
