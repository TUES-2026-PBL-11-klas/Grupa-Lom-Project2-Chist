package com.chist.reportmodule.service;

import com.chist.reportmodule.dto.CleaningTaskResponse;
import com.chist.reportmodule.dto.CreateCleaningTaskRequest;
import com.chist.reportmodule.exception.ReportNotFoundException;
import com.chist.reportmodule.model.CleaningTask;
import com.chist.reportmodule.model.Report;
import com.chist.reportmodule.model.ReportStatus;
import com.chist.reportmodule.model.TaskStatus;
import com.chist.reportmodule.repository.CleaningTaskRepository;
import com.chist.reportmodule.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CleaningTaskService {

    private final CleaningTaskRepository cleaningTaskRepository;
    private final ReportRepository reportRepository;

    public CleaningTaskResponse createCleaningTask(UUID cleanerId, CreateCleaningTaskRequest request){
        Report report = reportRepository.findById(request.getReportId())
                .orElseThrow(() -> new ReportNotFoundException("Report Not Found."));
        report.setStatus(ReportStatus.IN_PROGRESS);
        reportRepository.save(report);

        CleaningTask cleaningTask = CleaningTask.builder()
                .report(report)
                .cleanerId(cleanerId)
                .status(TaskStatus.PENDING)
                .verified(false)
                .build();

        return mapToDTO(cleaningTaskRepository.save(cleaningTask));
    }

    private CleaningTaskResponse mapToDTO(CleaningTask cleaningTask){
        return CleaningTaskResponse.builder()
                .id(cleaningTask.getId())
                .cleanerId(cleaningTask.getCleanerId())
                .beforePhoto(cleaningTask.getBeforePhoto())
                .afterPhoto(cleaningTask.getAfterPhoto())
                .verified(cleaningTask.isVerified())
                .status(cleaningTask.getStatus())
                .createdAt(cleaningTask.getCreatedAt())
                .updatedAt(cleaningTask.getUpdatedAt())
                .build();
    }


}
