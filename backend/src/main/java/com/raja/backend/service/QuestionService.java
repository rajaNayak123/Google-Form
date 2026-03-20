package com.raja.backend.service;

import com.raja.backend.dto.FormDtos.*;
import com.raja.backend.model.Question;
import com.raja.backend.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionResponse createQuestion(CreateQuestionRequest req) {
        Question question = Question.builder()
                .text(req.getText())
                .type(req.getType())
                .options(req.getOptions())
                .required(req.isRequired())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return toDto(questionRepository.save(question));
    }

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public QuestionResponse getQuestion(String id) {
        return questionRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Question not found: " + id));
    }

    public QuestionResponse updateQuestion(String id, CreateQuestionRequest req) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found: " + id));
        q.setText(req.getText());
        q.setType(req.getType());
        q.setOptions(req.getOptions());
        q.setRequired(req.isRequired());
        q.setUpdatedAt(LocalDateTime.now());
        return toDto(questionRepository.save(q));
    }

    public void deleteQuestion(String id) {
        questionRepository.deleteById(id);
    }

    public Question getQuestionEntity(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found: " + id));
    }

    private QuestionResponse toDto(Question q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .text(q.getText())
                .type(q.getType())
                .options(q.getOptions())
                .required(q.isRequired())
                .createdAt(q.getCreatedAt() != null ? q.getCreatedAt().toString() : null)
                .build();
    }
}