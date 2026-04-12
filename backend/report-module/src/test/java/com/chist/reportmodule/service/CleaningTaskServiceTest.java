package com.chist.reportmodule.service;

import com.chist.reportmodule.dto.CleaningTaskResponse;
import com.chist.reportmodule.dto.CreateCleaningTaskRequest;
import com.chist.reportmodule.exception.ReportOrTaskNotFoundException;
import com.chist.reportmodule.model.CleaningTask;
import com.chist.reportmodule.model.Report;
import com.chist.reportmodule.model.ReportStatus;
import com.chist.reportmodule.model.TaskStatus;
import com.chist.reportmodule.repository.CleaningTaskRepository;
import com.chist.reportmodule.repository.ReportRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CleaningTaskServiceTest {

    @Mock
    private CleaningTaskRepository cleaningTaskRepository;

    @Mock
    private ReportRepository reportRepository;

    @InjectMocks
    private CleaningTaskService cleaningTaskService;

    @Test
    void createCleaningTask_updatesReportAndCreatesPendingTask() {
        UUID reportId = UUID.randomUUID();
        UUID cleanerId = UUID.randomUUID();
        CreateCleaningTaskRequest request = CreateCleaningTaskRequest.builder().reportId(reportId).build();
        Report report = Report.builder().id(reportId).status(ReportStatus.NEW).build();
        CleaningTask savedTask = CleaningTask.builder()
                .id(UUID.randomUUID())
                .report(report)
                .cleanerId(cleanerId)
                .status(TaskStatus.PENDING)
                .verified(false)
                .build();

        when(reportRepository.findById(reportId)).thenReturn(Optional.of(report));
        when(cleaningTaskRepository.save(any(CleaningTask.class))).thenReturn(savedTask);

        CleaningTaskResponse response = cleaningTaskService.createCleaningTask(cleanerId, request);

        assertEquals(TaskStatus.PENDING, response.getStatus());
        assertEquals(reportId, response.getReportId());
        verify(reportRepository).save(report);
    }

    @Test
    void uploadPhotos_setsFieldsAndMovesToInProgress() {
        UUID taskId = UUID.randomUUID();
        Report report = Report.builder().id(UUID.randomUUID()).status(ReportStatus.IN_PROGRESS).build();
        CleaningTask task = CleaningTask.builder()
                .id(taskId)
                .report(report)
                .cleanerId(UUID.randomUUID())
                .status(TaskStatus.PENDING)
                .verified(false)
                .build();

        when(cleaningTaskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(cleaningTaskRepository.save(task)).thenReturn(task);

        CleaningTaskResponse response = cleaningTaskService.uploadPhotos(taskId, "before.jpg", "after.jpg");

        assertEquals("before.jpg", response.getBeforePhoto());
        assertEquals("after.jpg", response.getAfterPhoto());
        assertEquals(TaskStatus.IN_PROGRESS, response.getStatus());
    }

    @Test
    void completeTask_updatesTaskAndReportStatus() {
        UUID taskId = UUID.randomUUID();
        Report report = Report.builder().id(UUID.randomUUID()).status(ReportStatus.IN_PROGRESS).build();
        CleaningTask task = CleaningTask.builder()
                .id(taskId)
                .report(report)
                .cleanerId(UUID.randomUUID())
                .status(TaskStatus.IN_PROGRESS)
                .verified(false)
                .build();

        when(cleaningTaskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(cleaningTaskRepository.save(task)).thenReturn(task);

        CleaningTaskResponse response = cleaningTaskService.completeTask(taskId);

        assertEquals(TaskStatus.COMPLETED, response.getStatus());
        assertEquals(ReportStatus.CLEANED, report.getStatus());
        verify(reportRepository).save(report);
    }

    @Test
    void createCleaningTask_throwsWhenReportMissing() {
        UUID missingReportId = UUID.randomUUID();
        CreateCleaningTaskRequest request = CreateCleaningTaskRequest.builder().reportId(missingReportId).build();
        when(reportRepository.findById(missingReportId)).thenReturn(Optional.empty());

        assertThrows(
                ReportOrTaskNotFoundException.class,
                () -> cleaningTaskService.createCleaningTask(UUID.randomUUID(), request)
        );
    }
}
