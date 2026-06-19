package com.callpilotai.team.exception;

public class TeamMemberAlreadyExistsException extends RuntimeException {

    public TeamMemberAlreadyExistsException(String email) {
        super("A team member already exists with email: " + email);
    }
}
