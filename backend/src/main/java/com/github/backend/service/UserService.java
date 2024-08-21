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

    public String registerUser(User user){
        Optional<User> existingUser = userRepository.findByUserId(user.getUserId());
            if (existingUser.isPresent()) {
                return MessageService.EXISTING_USERID.getMessage();
            }
            Optional<User> existingNickname = userRepository.findByNickname(user.getNickname());

            if (existingNickname.isPresent()) {
                return MessageService.EXISTING_NICKNAME.getMessage();
            }

            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            userRepository.save(user);

            return MessageService.SUCCEED_CREATE_ACCOUNT.getMessage();
        }

    }




