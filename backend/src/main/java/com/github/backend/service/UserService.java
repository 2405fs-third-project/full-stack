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

    public void updateUserRole(Integer point,String userId){
        User user= userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException(MessageService.USER_NOT_FOUND.getMessage()));
        Role role;
        if (point >= 500) {
            role = Role.LEVEL5;
        } else if (point >= 400) {
            role = Role.LEVEL4;
        } else if (point >= 300) {
            role = Role.LEVEL3;
        } else if (point >= 200) {
            role = Role.LEVEL2;
        } else  {
            role = Role.LEVEL1;
        }
        user.setRole(role);
        user.setPoint(point);
        userRepository.save(user);
    }
    public enum Role {
        ADMIN,
        LEVEL5,
        LEVEL4,
        LEVEL3,
        LEVEL2,
        LEVEL1
    }
}






