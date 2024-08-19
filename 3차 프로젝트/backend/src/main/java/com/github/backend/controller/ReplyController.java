package com.github.backend.controller;

import com.github.backend.dto.AddReplyRequest;
import com.github.backend.dto.ReplyResponse;
import com.github.backend.dto.UpdateReplyRequest;
import com.github.backend.model.Reply;
import com.github.backend.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/replies")
public class ReplyController {

    private final ReplyService replyService;

    @PostMapping //댓글 작성
    public ResponseEntity<String> createReply(@RequestBody AddReplyRequest addReplyRequest) {
        replyService.createReply(addReplyRequest);
        return ResponseEntity.ok("Reply created successfully");
    }

    @PutMapping("/modify/{replyId}") //댓글 수정
    public ResponseEntity<String> updateReply(@PathVariable Integer replyId, @RequestBody UpdateReplyRequest updateReplyRequest) {
        replyService.updateReply(replyId, updateReplyRequest);
        return ResponseEntity.ok("Reply updated successfully");
    }

    @DeleteMapping("/delete/{replyId}") //댓글 삭제
    public ResponseEntity<String> deleteReply(@PathVariable Integer replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.ok("Reply deleted successfully");
    }

    @GetMapping("/{replyId}") //댓글 확인
    public ResponseEntity<ReplyResponse> getReply(@PathVariable Integer replyId) {
        ReplyResponse replyResponse = replyService.getReply(replyId);
        return ResponseEntity.ok(replyResponse);
    }
}
