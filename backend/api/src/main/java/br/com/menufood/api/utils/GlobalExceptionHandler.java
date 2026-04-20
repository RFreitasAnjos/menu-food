package br.com.menufood.api.utils;

import org.springframework.boot.autoconfigure.graphql.GraphQlProperties.Http;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.persistence.EntityNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
   @ExceptionHandler(RuntimeException.class)
   public ResponseEntity<ErrorResponse> handle(RuntimeException ex) {
      ErrorResponse errorResponse = ErrorResponse.create(ex, HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
   }

   @ExceptionHandler(EntityNotFoundException.class)
   public String handleEntityNotFoundException(EntityNotFoundException ex) {
       return ex.getMessage();
   }

   @ExceptionHandler(MethodArgumentNotValidException.class)
   public String handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
       return ex.getMessage();
   }
}
