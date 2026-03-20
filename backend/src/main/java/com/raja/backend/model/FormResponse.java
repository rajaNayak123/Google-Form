package com.raja.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "responses")
public class FormResponse {

    @Id
    private String id;

    private String formId;

    private String formTitle;

    // Map of questionId -> answer(s)
    private Map<String, Object> answers;

    private String respondentIp;

    private LocalDateTime submittedAt;
}