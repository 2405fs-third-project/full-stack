package com.github.backend.controller;


import com.github.backend.model.User;
import com.github.backend.service.AuthenticationService;
import com.github.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationService authenticationService;

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
            String LoginResult = authenticationService.authenticate(user.getUserId(),user.getPassword());
            if (LoginResult.startsWith("ERROR: ")) {
                return new ResponseEntity<>(LoginResult, HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(LoginResult,HttpStatus.OK );

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
