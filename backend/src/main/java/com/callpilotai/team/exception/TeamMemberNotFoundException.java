package com.callpilotai.team.exception;

public class TeamMemberNotFoundException extends RuntimeException {

    public TeamMemberNotFoundException() {
        super("Team member was not found.");
    }
}
