package com.incidentflow.incidentflow.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.incidentflow.incidentflow.dto.RegisterRequest;
import com.incidentflow.incidentflow.entity.User;
import com.incidentflow.incidentflow.exception.DuplicateEmailException;
import com.incidentflow.incidentflow.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName(),
                request.getEmail(),
                hashedPassword,
                request.getRole()
        );

        return userRepository.save(user);
    }
}