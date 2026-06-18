package com.callpilotai.business.exception;

public class InvalidTimezoneException extends RuntimeException {

    public InvalidTimezoneException(String timezone) {
        super("Timezone is invalid: " + timezone);
    }
}

