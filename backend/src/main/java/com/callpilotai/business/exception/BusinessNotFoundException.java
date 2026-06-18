package com.callpilotai.business.exception;

public class BusinessNotFoundException extends RuntimeException {

    public BusinessNotFoundException() {
        super("Business was not found.");
    }
}

