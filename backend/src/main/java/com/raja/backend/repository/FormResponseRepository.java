package com.raja.backend.repository;

import com.raja.backend.model.FormResponse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormResponseRepository extends MongoRepository<FormResponse, String> {
    List<FormResponse> findByFormId(String formId);
    long countByFormId(String formId);
}