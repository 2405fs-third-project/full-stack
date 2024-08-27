package com.github.backend.service;

import com.github.backend.model.User;
import com.github.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public String authenticate(String userid, String password){

        User user = userRepository.findByUserId(userid).orElse(null);

        if(user == null){
            return MessageService.USER_NOT_FOUND.getMessage();
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return MessageService.INVALID_PASSWORD.getMessage();
        }
        return tokenService.generateToken(user.getUserId(), user.getRole().name());

    }

}