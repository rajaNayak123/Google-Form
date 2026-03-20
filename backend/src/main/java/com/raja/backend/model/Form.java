package com.raja.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "forms")
public class Form {

    @Id
    private String id;

    private String title;

    private String description;

    private String uniqueSlug; // used to generate public link

    private List<FormField> fields;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FormField {
        private String questionId;
        private String questionText;          // snapshot at time of form creation
        private Question.QuestionType type;
        private List<String> options;
        private boolean required;
        private int order;
    }
}