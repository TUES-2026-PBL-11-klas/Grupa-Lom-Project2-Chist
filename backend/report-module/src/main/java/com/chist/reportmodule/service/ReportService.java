package com.chist.reportmodule.service;


import com.chist.reportmodule.dto.CreateReportRequest;
import com.chist.reportmodule.dto.ReportResponse;
import com.chist.reportmodule.model.Report;
import com.chist.reportmodule.model.ReportStatus;
import com.chist.reportmodule.repository.ReportRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ReportService {

    private ReportRepository reportRepository;

    public ReportResponse createReport(UUID userId, CreateReportRequest request){
        Report report = Report.builder()
                .userId(userId)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .photoUrl(request.getPhotoUrl())
                .description(request.getDescription())
                .status(ReportStatus.NEW)
                .build();
        return
    }
}
