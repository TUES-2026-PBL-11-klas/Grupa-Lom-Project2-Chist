package com.chist.reportmodule.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.UUID;


@Entity
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class CleaningTask {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "task_id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id",nullable = false)
    private Report report;

}
