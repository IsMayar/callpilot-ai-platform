package com.callpilotai.customers.exception;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException() {
        super("Customer was not found.");
    }
}

