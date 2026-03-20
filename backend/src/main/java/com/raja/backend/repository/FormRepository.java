package com.raja.backend.repository;

import com.raja.backend.model.Form;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormRepository extends MongoRepository<Form, String> {
    Optional<Form> findByUniqueSlug(String uniqueSlug);
    boolean existsByUniqueSlug(String uniqueSlug);
}