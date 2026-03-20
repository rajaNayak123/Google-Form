package com.raja.backend.controller;

import com.raja.backend.dto.FormDtos.*;
import com.raja.backend.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponse> create(@Valid @RequestBody CreateQuestionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(questionService.createQuestion(req));
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAll() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(questionService.getQuestion(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> update(
            @PathVariable String id,
            @Valid @RequestBody CreateQuestionRequest req) {
        return ResponseEntity.ok(questionService.updateQuestion(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}