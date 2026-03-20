package com.raja.backend.service;

import com.raja.backend.dto.FormDtos.*;
import com.raja.backend.model.Form;
import com.raja.backend.model.Question;
import com.raja.backend.repository.FormRepository;
import com.raja.backend.repository.FormResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;
    private final FormResponseRepository responseRepository;
    private final QuestionService questionService;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    public FormDetailResponse createForm(CreateFormRequest req) {
        String slug = generateUniqueSlug();
        List<Form.FormField> fields = buildFields(req.getFields());

        Form form = Form.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .uniqueSlug(slug)
                .fields(fields)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return toDetailDto(formRepository.save(form));
    }

    public List<FormSummaryResponse> getAllForms() {
        return formRepository.findAll().stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    public FormDetailResponse getFormById(String id) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found: " + id));
        return toDetailDto(form);
    }

    public FormDetailResponse getFormBySlug(String slug) {
        Form form = formRepository.findByUniqueSlug(slug)
                .orElseThrow(() -> new RuntimeException("Form not found for slug: " + slug));
        return toDetailDto(form);
    }

    public FormDetailResponse updateForm(String id, CreateFormRequest req) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found: " + id));

        form.setTitle(req.getTitle());
        form.setDescription(req.getDescription());
        form.setFields(buildFields(req.getFields()));
        form.setUpdatedAt(LocalDateTime.now());

        return toDetailDto(formRepository.save(form));
    }

    public void deleteForm(String id) {
        formRepository.deleteById(id);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private List<Form.FormField> buildFields(List<FormFieldRequest> fieldRequests) {
        if (fieldRequests == null) return List.of();

        return fieldRequests.stream().map(fr -> {
            String questionText = fr.getQuestionText();
            Question.QuestionType type = fr.getType();
            List<String> options = fr.getOptions();
            boolean required = fr.isRequired();

            if (fr.getQuestionId() != null && !fr.getQuestionId().isBlank()) {
                try {
                    Question q = questionService.getQuestionEntity(fr.getQuestionId());
                    if (questionText == null || questionText.isBlank()) questionText = q.getText();
                    if (type == null) type = q.getType();
                    if (options == null) options = q.getOptions();
                } catch (Exception ignored) {}
            }

            return Form.FormField.builder()
                    .questionId(fr.getQuestionId())
                    .questionText(questionText)
                    .type(type)
                    .options(options)
                    .required(required)
                    .order(fr.getOrder())
                    .build();
        }).collect(Collectors.toList());
    }

    private String generateUniqueSlug() {
        String slug;
        do {
            slug = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        } while (formRepository.existsByUniqueSlug(slug));
        return slug;
    }

    private FormSummaryResponse toSummaryDto(Form form) {
        return FormSummaryResponse.builder()
                .id(form.getId())
                .title(form.getTitle())
                .description(form.getDescription())
                .uniqueSlug(form.getUniqueSlug())
                .publicLink(baseUrl + "/f/" + form.getUniqueSlug())
                .active(form.isActive())
                .responseCount(responseRepository.countByFormId(form.getId()))
                .createdAt(form.getCreatedAt() != null ? form.getCreatedAt().toString() : null)
                .build();
    }

    private FormDetailResponse toDetailDto(Form form) {
        List<FormFieldResponse> fieldDtos = form.getFields() == null ? List.of() :
                form.getFields().stream().map(f -> FormFieldResponse.builder()
                        .questionId(f.getQuestionId())
                        .questionText(f.getQuestionText())
                        .type(f.getType())
                        .options(f.getOptions())
                        .required(f.isRequired())
                        .order(f.getOrder())
                        .build()).collect(Collectors.toList());

        return FormDetailResponse.builder()
                .id(form.getId())
                .title(form.getTitle())
                .description(form.getDescription())
                .uniqueSlug(form.getUniqueSlug())
                .publicLink(baseUrl + "/f/" + form.getUniqueSlug())
                .active(form.isActive())
                .fields(fieldDtos)
                .createdAt(form.getCreatedAt() != null ? form.getCreatedAt().toString() : null)
                .build();
    }
}