package com.raja.backend.dto;

import com.raja.backend.model.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public class FormDtos {

    // Question DTOs

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateQuestionRequest {
        @NotBlank private String text;
        @NotNull  private Question.QuestionType type;
        private List<String> options;
        private boolean required;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class QuestionResponse {
        private String id;
        private String text;
        private Question.QuestionType type;
        private List<String> options;
        private boolean required;
        private String createdAt;
    }

    // Form DTOs 

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateFormRequest {
        @NotBlank private String title;
        private String description;
        private List<FormFieldRequest> fields;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FormFieldRequest {
        private String questionId;
        private String questionText;
        private Question.QuestionType type;
        private List<String> options;
        private boolean required;
        private int order;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FormSummaryResponse {
        private String id;
        private String title;
        private String description;
        private String uniqueSlug;
        private String publicLink;
        private boolean active;
        private long responseCount;
        private String createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FormDetailResponse {
        private String id;
        private String title;
        private String description;
        private String uniqueSlug;
        private String publicLink;
        private boolean active;
        private List<FormFieldResponse> fields;
        private String createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FormFieldResponse {
        private String questionId;
        private String questionText;
        private Question.QuestionType type;
        private List<String> options;
        private boolean required;
        private int order;
    }

    // Response DTOs 

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SubmitResponseRequest {
        @NotNull private Map<String, Object> answers;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class FormResponseDto {
        private String id;
        private String formId;
        private String formTitle;
        private Map<String, Object> answers;
        private String submittedAt;
    }
}