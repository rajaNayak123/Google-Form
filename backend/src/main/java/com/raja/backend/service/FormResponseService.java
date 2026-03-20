package com.raja.backend.service;

import com.raja.backend.dto.FormDtos.*;
import com.raja.backend.model.FormResponse;
import com.raja.backend.repository.FormResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormResponseService {

    private final FormResponseRepository responseRepository;
    private final FormService formService;

    public FormResponseDto submitResponse(String slug, SubmitResponseRequest req, String ip) {
        FormDetailResponse form = formService.getFormBySlug(slug);

        FormResponse response = FormResponse.builder()
                .formId(form.getId())
                .formTitle(form.getTitle())
                .answers(req.getAnswers())
                .respondentIp(ip)
                .submittedAt(LocalDateTime.now())
                .build();

        return toDto(responseRepository.save(response));
    }

    public List<FormResponseDto> getResponsesForForm(String formId) {
        return responseRepository.findByFormId(formId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private FormResponseDto toDto(FormResponse r) {
        return FormResponseDto.builder()
                .id(r.getId())
                .formId(r.getFormId())
                .formTitle(r.getFormTitle())
                .answers(r.getAnswers())
                .submittedAt(r.getSubmittedAt() != null ? r.getSubmittedAt().toString() : null)
                .build();
    }
}