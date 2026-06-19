package com.callpilotai.leads.exception;

public class LeadNotFoundException extends RuntimeException {

    public LeadNotFoundException() {
        super("Lead was not found.");
    }
}

