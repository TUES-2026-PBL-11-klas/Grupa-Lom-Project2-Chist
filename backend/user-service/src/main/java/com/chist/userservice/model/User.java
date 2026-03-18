package com.chist.userservice.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uuid;

    @Column(nullable = false,unique = true,length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false,length = 100)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private int points;

    @Column(nullable = false)
    private int streak;

    @CreatedDate
    @Column(nullable = false,name = "created_at")
    private Date created_at;

    @LastModifiedDate
    @Column(nullable = false,name = "updated_at")
    private Date updated_at;
}
