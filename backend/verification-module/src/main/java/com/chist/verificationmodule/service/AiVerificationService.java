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


    @Value("${COMPUTER_VISION_ENDPOINT}")
    private String endpoint;

    @Value("${COMPUTER_VISION_KEY}")
    private String key;

    private ImageAnalysisAsyncClient getClient() {
        return new ImageAnalysisClientBuilder()
                .endpoint(endpoint)
                .credential(new KeyCredential(key))
                .buildAsyncClient();
    }

    public Mono<Boolean> verifyClean(String beforePhotoUrl, String afterPhotoUrl) {
        ImageAnalysisAsyncClient client = getClient();

        Mono<ImageAnalysisResult> beforeMono = client.analyzeFromUrl(
                beforePhotoUrl,
                Arrays.asList(VisualFeatures.TAGS, VisualFeatures.CAPTION),
                null
        );

        Mono<ImageAnalysisResult> afterMono = client.analyzeFromUrl(
                afterPhotoUrl,
                Arrays.asList(VisualFeatures.TAGS, VisualFeatures.CAPTION),
                null
        );

        return Mono.zip(beforeMono, afterMono)
                .map(tuple -> {
                    boolean beforeHasTrash = containsTrashTags(tuple.getT1());
                    boolean afterHasTrash = containsTrashTags(tuple.getT2());

                    // Before MUST have trash, after MUST be clean
                    return beforeHasTrash && !afterHasTrash;
                })
                .onErrorReturn(false);
    }

    public Mono<Boolean> verifyHasTrash(String photoUrl) {
        ImageAnalysisAsyncClient client = getClient();

        return client.analyzeFromUrl(
                photoUrl,
                Arrays.asList(VisualFeatures.TAGS, VisualFeatures.CAPTION),
                null
        )
        .map(this::containsTrashTags)
        .onErrorReturn(false);
    }

    private boolean containsTrashTags(ImageAnalysisResult result) {
        if (result.getTags() == null) return false;

        // Log all tags from Azure for debugging
        result.getTags().getValues().forEach(tag ->
                System.out.println("AZURE TAG: " + tag.getName() + " | confidence: " + tag.getConfidence())
        );

        return result.getTags().getValues().stream()
                .filter(tag -> tag.getConfidence() > 0.5)
                .anyMatch(tag -> {
                    String name = tag.getName().toLowerCase();
                    return name.contains("trash") ||
                            name.contains("garbage") ||
                            name.contains("waste") ||
                            name.contains("litter") ||
                            name.contains("dirty") ||
                            name.contains("pollution") ||
                            name.contains("debris") ||
                            name.contains("junk") ||
                            name.contains("bottle") ||
                            name.contains("plastic") ||
                            name.contains("rubbish") ||
                            name.contains("dumpster") ||
                            name.contains("recycling") ||
                            name.contains("mess") ||
                            name.contains("filth") ||
                            name.contains("container") ||
                            name.contains("bag") ||
                            name.contains("dump") ||
                            name.contains("scrap") ||
                            name.contains("litter");
                });
    }
}
