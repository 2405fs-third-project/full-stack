package com.github.backend.service;

import com.github.backend.model.User;
import com.github.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(User user) throws Exception {

        Optional<User> existingUser = userRepository.findByUserId(user.getUserId());
        if (existingUser.isPresent()) {
            throw new Exception(user.getUserId()+"가 이미 존재합니다. 다른 아이디로 변경해주세요.");
        }
        Optional<User> existingNickname = userRepository.findByNickname(user.getNickname());
        if (existingNickname.isPresent()) {
            throw new Exception(user.getNickname()+ "가 이미 존재합니다. 다른 닉네임으로 변경해주세요.");
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }



}
