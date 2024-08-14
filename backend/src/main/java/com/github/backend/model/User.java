package com.github.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "phone", nullable = false, length = 50)
    private String phone;

    @Column(name = "userid", nullable = false, unique = true, length = 50)
    private String userId;

    @Column(name = "password", nullable = false, length = 50)
    private String password;

    @Column(name = "nickname", nullable = false, unique = true, length = 50)
    private String nickname;
}
