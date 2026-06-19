package com.callpilotai.calls.exception;

public class CallRecordNotFoundException extends RuntimeException {

    public CallRecordNotFoundException() {
        super("Call record was not found.");
    }
}

