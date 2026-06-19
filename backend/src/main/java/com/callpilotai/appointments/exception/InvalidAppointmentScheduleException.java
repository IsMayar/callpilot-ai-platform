package com.callpilotai.appointments.exception;

public class InvalidAppointmentScheduleException extends RuntimeException {

    public InvalidAppointmentScheduleException() {
        super("Scheduled end must be after scheduled start.");
    }
}

