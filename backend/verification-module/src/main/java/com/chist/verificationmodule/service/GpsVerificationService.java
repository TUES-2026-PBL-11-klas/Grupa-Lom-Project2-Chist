package com.chist.verificationmodule.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GpsVerificationService {

    @Value("${verification.gps.max-distance-meters}")
    private Double maxDistanceMeters;

    public boolean verify(double expectedLatitude, double expectedLongitude,
                          double actualLatitude, double actualLongitude) {

    }

    private double calculateDistance(double lat1,double lat2,double lon1,double lon2) {

    }
}
