package com.raja.backend.controller;

import com.raja.backend.dto.FormDtos.*;
import com.raja.backend.service.FormResponseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResponseController {

    private final FormResponseService responseService;

    /** Public endpoint — anyone with the link can submit */
    @PostMapping("/f/{slug}/responses")
    public ResponseEntity<FormResponseDto> submit(
            @PathVariable String slug,
            @Valid @RequestBody SubmitResponseRequest req,
            HttpServletRequest httpReq) {
        String ip = httpReq.getRemoteAddr();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(responseService.submitResponse(slug, req, ip));
    }

    /** Admin endpoint — list all responses for a form */
    @GetMapping("/forms/{formId}/responses")
    public ResponseEntity<List<FormResponseDto>> getResponses(@PathVariable String formId) {
        return ResponseEntity.ok(responseService.getResponsesForForm(formId));
    }
}