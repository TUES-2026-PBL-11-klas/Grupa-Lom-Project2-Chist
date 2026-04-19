package com.chist.verificationmodule.service;

import com.azure.ai.vision.imageanalysis.ImageAnalysisClientBuilder;
import com.azure.ai.vision.imageanalysis.models.ImageAnalysisResult;
import com.azure.ai.vision.imageanalysis.models.VisualFeatures;
import com.azure.core.credential.KeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.azure.ai.vision.imageanalysis.ImageAnalysisAsyncClient;
import reactor.core.publisher.Mono;

import java.util.Arrays;

@Service
public class AiVerificationService {


    @Value("${COMPUTER_VISION_ENDPOINT:placeholder}")
    private String endpoint;

    @Value("${COMPUTER_VISION_KEY:placeholder}")
    private String key;


    private ImageAnalysisAsyncClient getClient() {
        return new ImageAnalysisClientBuilder()
                .endpoint(endpoint)
                .credential(new KeyCredential(key))
                .buildAsyncClient();
    }

   public Mono<Boolean> verifyClean(String beforePhotoUrl,String afterPhotoUrl) {
        ImageAnalysisAsyncClient client = getClient();

        Mono<ImageAnalysisResult> beforeMono = client.analyzeFromUrl(
                beforePhotoUrl,
                Arrays.asList(VisualFeatures.TAGS,VisualFeatures.CAPTION),
                null
        );

        Mono<ImageAnalysisResult> afterMono = client.analyzeFromUrl(
                afterPhotoUrl,
                Arrays.asList(VisualFeatures.TAGS,VisualFeatures.CAPTION),
                null
        );

        return Mono.zip(beforeMono,afterMono)
                .map(tuple ->{
                    boolean beforeHasTrash = containsTrashTags(tuple.getT1());
                    boolean afterHasTrash = containsTrashTags(tuple.getT2());
                    return beforeHasTrash && afterHasTrash;
                })
                .onErrorReturn(false);
    }

    private boolean containsTrashTags(ImageAnalysisResult result) {
        if (result.getTags() == null) return false;
        return result.getTags().getValues().stream()
                .anyMatch(tag -> {
                    String name = tag.getName().toLowerCase();
                    return name.contains("trash") ||
                            name.contains("garbage") ||
                            name.contains("waste") ||
                            name.contains("litter") ||
                            name.contains("dirty") ||
                            name.contains("pollution");
                });
    }



}
