package lk.earth.earthuniversity.util;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolationException;
import java.util.HashMap;

/**
 * Turns the three exceptions that used to surface as a raw 500 stack trace into the
 * same {"errors": "..."} shape every controller already returns, so the Angular
 * message dialog shows something a user can act on.
 *
 * HTTP 200 is deliberate: it matches the convention used throughout this API, where
 * failures are reported in the body rather than the status line. Every component
 * already reads response['errors'].
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    private HashMap<String, String> body(String message) {
        HashMap<String, String> response = new HashMap<>();
        response.put("errors", message);
        return response;
    }

    /** Bean Validation (@Pattern, @NotNull ...) failing at Hibernate flush time. */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> onConstraintViolation(ConstraintViolationException e) {
        StringBuilder sb = new StringBuilder("Server Validation Errors : ");
        e.getConstraintViolations().forEach(v -> sb.append("<br>").append(v.getMessage()));
        return body(sb.toString());
    }

    /** NOT NULL columns, foreign keys, unique indexes. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> onDataIntegrity(DataIntegrityViolationException e) {
        Throwable root = e;
        while (root.getCause() != null && root.getCause() != root) root = root.getCause();
        String raw = root.getMessage() == null ? "" : root.getMessage();
        String message;

        if (raw.contains("cannot be null")) {
            message = "A required field was left empty. Please fill in every field marked with *.";
        } else if (raw.toLowerCase().contains("foreign key constraint fails")) {
            message = "This record is still used by other records, so it cannot be deleted. "
                    + "Remove the records that reference it first.";
        } else if (raw.toLowerCase().contains("duplicate entry")) {
            message = "That value already exists. Please use a different one.";
        } else if (raw.toLowerCase().contains("data too long")) {
            message = "One of the values is too long for the field.";
        } else {
            message = "The record could not be saved because it breaks a database rule.";
        }
        return body("Server Validation Errors : <br>" + message);
    }

    /** Malformed or unparseable request body. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.OK)
    public HashMap<String, String> onUnreadable(HttpMessageNotReadableException e) {
        return body("Server Validation Errors : <br>The data sent to the server could not be read. "
                  + "Please reload the page and try again.");
    }
}
