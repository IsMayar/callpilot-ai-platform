package com.callpilotai.business.exception;

public class BusinessAlreadyExistsException extends RuntimeException {

    public BusinessAlreadyExistsException() {
        super("A business already exists for the authenticated account.");
    }
}

