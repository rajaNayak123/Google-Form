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
@Document(collection = "questions")
public class Question {

    @Id
    private String id;

    private String text;

    private QuestionType type;

    private List<String> options; // for SINGLE_CHOICE and MULTIPLE_CHOICE

    private boolean required;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum QuestionType {
        SHORT_ANSWER,
        LONG_ANSWER,
        NUMBER,
        YES_NO,
        SINGLE_CHOICE,
        MULTIPLE_CHOICE,
        DATE
    }
}