package com.chist.reportmodule.service;


import com.chist.reportmodule.dto.CreateReportRequest;
import com.chist.reportmodule.dto.ReportResponse;
import com.chist.reportmodule.exception.ReportOrTaskNotFoundException;
import com.chist.reportmodule.model.Report;
import com.chist.reportmodule.model.ReportStatus;
import com.chist.reportmodule.repository.ReportRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
        return mapToDTO(reportRepository.save(report));

    }

    public ReportResponse getReportById(UUID  reportId){
        return mapToDTO(reportRepository.findById(reportId)
                .orElseThrow(() -> new ReportOrTaskNotFoundException("Report Not Found.")));
    }

    public List<ReportResponse> getReportsByUserId(UUID userId){
        return reportRepository.findByUserId(userId)
                .stream()
                .map(this :: mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> getReportsByStatus(ReportStatus status){
        return reportRepository.findByStatus(status)
                .stream()
                .map(this :: mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ReportResponse> getAllReports(){
        return reportRepository.findAll()
                .stream()
                .map(this :: mapToDTO)
                .collect(Collectors.toList());
    }

    public ReportResponse updateStatus(UUID reportId, ReportStatus status){
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ReportOrTaskNotFoundException("Report Not Found."));
        report.setStatus(status);
        return mapToDTO(reportRepository.save(report));
    }

    public void deleteReport(UUID reportId){
        if(!reportRepository.existsById(reportId)){
            throw new ReportOrTaskNotFoundException("Report Not Found.");
        }
        reportRepository.deleteById(reportId);
    }


    private ReportResponse mapToDTO(Report report) {
        return ReportResponse.builder()
                .reportId(report.getId())
                .userId(report.getUserId())
                .latitude(report.getLatitude())
                .longitude(report.getLongitude())
                .photoUrl(report.getPhotoUrl())
                .description(report.getDescription())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}
