package com.github.backend.service;

import com.github.backend.dto.PostResponse;
import com.github.backend.dto.ReplyResponse;
import com.github.backend.dto.UpdateReplyRequest;
import com.github.backend.dto.AddReplyRequest;
import com.github.backend.model.Post;
import com.github.backend.model.Reply;
import com.github.backend.model.User;
import com.github.backend.repository.PostRepository;
import com.github.backend.repository.ReplyRepository;
import com.github.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public void createReply(AddReplyRequest addReplyRequest) {
        try {
            Post post = postRepository.findById(addReplyRequest.getPostId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));

            User user = userRepository.findById(addReplyRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Integer replypt = user.getPoint() + 5;
            String userId = user.getUserId();
            userService.updateUserRole(replypt, userId);

            Reply reply = Reply.builder()
                    .post(post)
                    .user(user)
                    .replyContent(addReplyRequest.getReplyContent())
                    .replyCreate(LocalDateTime.now())
                    .build();

            // 댓글 저장
            replyRepository.save(reply);
        } catch (OptimisticLockingFailureException e) {
            log.error("Optimistic locking failure while creating reply: {}", e.getMessage());
            throw new RuntimeException("Failed to create reply due to optimistic locking", e);
        }
    }

    @Transactional
    public void updateReply(Integer replyId, UpdateReplyRequest updateReplyRequest) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        reply.setReplyContent(updateReplyRequest.getReplyContent());
        replyRepository.save(reply);
    }

    @Transactional
    public void deleteReply(Integer replyId) {
        Reply reply = replyRepository.findByIdWithLock(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        // 사용자 조회
        User user = reply.getUser();

        if (user.getPoint() >= 5) {
            Integer postpt = user.getPoint() - 5;
            String userId = user.getUserId();
            userService.updateUserRole(postpt, userId);
        } else {
            user.setPoint(0);
            String userId = user.getUserId();
            userService.updateUserRole(0, userId); // 포인트가 0보다 작아질 경우 0으로 설정
        }

        userRepository.save(user);

        replyRepository.delete(reply);
    }

    @Transactional(readOnly = true)
    public ReplyResponse getReply(Integer replyId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        return new ReplyResponse(
                reply.getId(),
                reply.getPost().getId(),
                reply.getUser().getId(),
                reply.getReplyContent(),
                reply.getReplyCreate(),
                reply.getUser().getNickname()
        );
    }

    @Transactional(readOnly = true) // 특정 게시글의 댓글 목록 조회
    public List<ReplyResponse> getRepliesByPostId(Integer postId) {
        List<Reply> replies = replyRepository.findByPostId(postId); // postId로 댓글 필터링

        return replies.stream()
                .map(reply -> new ReplyResponse(
                        reply.getId(),
                        reply.getPost().getId(),
                        reply.getUser().getId(),
                        reply.getReplyContent(),
                        reply.getReplyCreate(),
                        reply.getUser().getNickname()
                ))
                .collect(Collectors.toList());
    }
}
