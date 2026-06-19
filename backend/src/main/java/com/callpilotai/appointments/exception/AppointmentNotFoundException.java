package com.callpilotai.appointments.exception;

public class AppointmentNotFoundException extends RuntimeException {

    public AppointmentNotFoundException() {
        super("Appointment was not found.");
    }
}

