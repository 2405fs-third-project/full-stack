package com.github.backend.service;

import com.github.backend.model.User;
import com.github.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public String authenticate(String userid, String password){

        User user = userRepository.findByUserId(userid).orElse(null);

        if(user == null){
            return "아이디가 존재하지 않습니다.";
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "비밀번호가 틀립니다.";
        }

        return jwtService.generateToken(userid);

    }

}
