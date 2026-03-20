package com.raja.backend.controller;

import com.raja.backend.dto.FormDtos.*;
import com.raja.backend.service.FormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;

    @PostMapping
    public ResponseEntity<FormDetailResponse> create(@Valid @RequestBody CreateFormRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(formService.createForm(req));
    }

    @GetMapping
    public ResponseEntity<List<FormSummaryResponse>> getAll() {
        return ResponseEntity.ok(formService.getAllForms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormDetailResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(formService.getFormById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<FormDetailResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(formService.getFormBySlug(slug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormDetailResponse> update(
            @PathVariable String id,
            @Valid @RequestBody CreateFormRequest req) {
        return ResponseEntity.ok(formService.updateForm(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        formService.deleteForm(id);
        return ResponseEntity.noContent().build();
    }
}