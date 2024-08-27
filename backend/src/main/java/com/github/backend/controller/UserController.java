package com.github.backend.controller;


import com.github.backend.model.User;
import com.github.backend.repository.UserRepository;
import com.github.backend.service.AuthenticationService;
import com.github.backend.service.MessageService;
import com.github.backend.service.TokenService;
import com.github.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final TokenService tokenService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            String RegisterResult = userService.registerUser(user);
            return new ResponseEntity<>(RegisterResult, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        try {
            String LoginResult = authenticationService.authenticate(user.getUserId(), user.getPassword());
            if (LoginResult.startsWith("ERROR: ")) {
                return new ResponseEntity<>(LoginResult, HttpStatus.BAD_REQUEST);
            }
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + LoginResult) // JWT 토큰을 헤더에 포함
                    .body(MessageService.SUCCEED_LOGIN.getMessage());

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/my/{userId}")
    public ResponseEntity<?> getUserData(@PathVariable String userId, @RequestHeader("Authorization") String Token) {
        try {
            Token = Token.replace("Bearer ", "");
            Optional<User> user = userRepository.findByUserId(userId);


            boolean isValidToken = tokenService.validateToken(Token, userId);
            if (!isValidToken) {
                return new ResponseEntity<>(MessageService.EXPIRED_ACCESS_TOKEN, HttpStatus.UNAUTHORIZED);
            }
            if (user.isEmpty()) {
                return new ResponseEntity<>(MessageService.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            User userData = user.get();
            userData.setPassword(null);

            return ResponseEntity.ok().header("Authorization", "Bearer " + Token).body(userData);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
