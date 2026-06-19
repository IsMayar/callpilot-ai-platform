package com.callpilotai.demo;

import com.callpilotai.aiconfig.AiReceptionistConfig;
import com.callpilotai.aiconfig.AiReceptionistConfigRepository;
import com.callpilotai.appointments.Appointment;
import com.callpilotai.appointments.AppointmentRepository;
import com.callpilotai.appointments.AppointmentStatus;
import com.callpilotai.billing.SubscriptionPlan;
import com.callpilotai.billing.SubscriptionPlanRepository;
import com.callpilotai.billing.SubscriptionPlanStatus;
import com.callpilotai.business.Business;
import com.callpilotai.business.BusinessRepository;
import com.callpilotai.calls.CallRecord;
import com.callpilotai.calls.CallRecordRepository;
import com.callpilotai.calls.CallStatus;
import com.callpilotai.config.properties.DemoAuthProperties;
import com.callpilotai.customers.Customer;
import com.callpilotai.customers.CustomerRepository;
import com.callpilotai.leads.Lead;
import com.callpilotai.leads.LeadRepository;
import com.callpilotai.leads.LeadStatus;
import com.callpilotai.messages.Message;
import com.callpilotai.messages.MessageChannel;
import com.callpilotai.messages.MessageDirection;
import com.callpilotai.messages.MessageRepository;
import com.callpilotai.messages.MessageStatus;
import com.callpilotai.team.TeamMember;
import com.callpilotai.team.TeamMemberRepository;
import com.callpilotai.team.TeamMemberRole;
import com.callpilotai.team.TeamMemberStatus;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
public class DemoDataSeeder implements ApplicationRunner {

    private final AiReceptionistConfigRepository aiReceptionistConfigRepository;
    private final AppointmentRepository appointmentRepository;
    private final BusinessRepository businessRepository;
    private final CallRecordRepository callRecordRepository;
    private final CustomerRepository customerRepository;
    private final DemoAuthProperties demoAuthProperties;
    private final LeadRepository leadRepository;
    private final MessageRepository messageRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final TeamMemberRepository teamMemberRepository;

    public DemoDataSeeder(
            AiReceptionistConfigRepository aiReceptionistConfigRepository,
            AppointmentRepository appointmentRepository,
            BusinessRepository businessRepository,
            CallRecordRepository callRecordRepository,
            CustomerRepository customerRepository,
            DemoAuthProperties demoAuthProperties,
            LeadRepository leadRepository,
            MessageRepository messageRepository,
            SubscriptionPlanRepository subscriptionPlanRepository,
            TeamMemberRepository teamMemberRepository) {
        this.aiReceptionistConfigRepository = aiReceptionistConfigRepository;
        this.appointmentRepository = appointmentRepository;
        this.businessRepository = businessRepository;
        this.callRecordRepository = callRecordRepository;
        this.customerRepository = customerRepository;
        this.demoAuthProperties = demoAuthProperties;
        this.leadRepository = leadRepository;
        this.messageRepository = messageRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Business business = seedBusiness();
        Customer sarah = seedCustomer(
                business,
                "Sarah Miller",
                "+1 512-555-0142",
                "sarah.miller@example.com",
                "410 Barton Springs Rd, Austin, TX",
                "Prefers morning appointments. Interested in seasonal maintenance.");
        Customer marcus = seedCustomer(
                business,
                "Marcus Chen",
                "+1 512-555-0176",
                "marcus.chen@example.com",
                "88 Rainey St, Austin, TX",
                "Commercial property manager with multiple rooftop units.");
        Customer elena = seedCustomer(
                business,
                "Elena Rodriguez",
                "+1 512-555-0118",
                "elena.rodriguez@example.com",
                "1701 South Congress Ave, Austin, TX",
                "Requested text follow-up after the first visit.");

        Lead emergencyRepair = seedLead(
                business,
                "Jordan Blake",
                "+1 512-555-0184",
                "jordan.blake@example.com",
                "Emergency AC repair",
                "Urgent",
                LeadStatus.NEW,
                new BigDecimal("950.00"),
                "No cooling during a heat advisory. AI captured address and preferred arrival window.");
        Lead replacementQuote = seedLead(
                business,
                "Priya Shah",
                "+1 512-555-0133",
                "priya.shah@example.com",
                "Full HVAC replacement quote",
                "High",
                LeadStatus.BOOKED,
                new BigDecimal("6800.00"),
                "Booked comfort advisor visit for replacement estimate.");
        Lead maintenancePlan = seedLead(
                business,
                "Theo Williams",
                "+1 512-555-0161",
                "theo.williams@example.com",
                "Maintenance plan",
                "Medium",
                LeadStatus.CONTACTED,
                new BigDecimal("420.00"),
                "Interested in annual tune-up plan for two systems.");
        Lead ductwork = seedLead(
                business,
                "Nora Patel",
                "+1 512-555-0155",
                "nora.patel@example.com",
                "Ductwork inspection",
                "Medium",
                LeadStatus.CLOSED,
                new BigDecimal("1250.00"),
                "Converted after AI recovered missed call and scheduled inspection.");

        seedCalls(business, sarah, marcus, emergencyRepair, replacementQuote, maintenancePlan);
        seedAppointments(business, sarah, marcus, elena, replacementQuote, ductwork);
        seedMessages(business, sarah, emergencyRepair, replacementQuote);
        seedAiConfig(business);
        seedTeamMember(business);
        seedBillingPlan(business);
    }

    private Business seedBusiness() {
        String ownerSubject = demoAuthProperties.email();
        Business business = businessRepository.findByOwnerSubject(ownerSubject)
                .orElseGet(() -> businessRepository.save(new Business(
                        ownerSubject,
                        "Austin Prime HVAC",
                        "HVAC",
                        "+1 512-555-0199",
                        "America/Chicago")));

        business.update(
                "Austin Prime HVAC",
                "HVAC",
                "+1 512-555-0199",
                "America/Chicago");
        return business;
    }

    private Customer seedCustomer(
            Business business,
            String fullName,
            String phoneNumber,
            String email,
            String address,
            String notes) {
        return customerRepository.findByBusinessIdAndEmailIgnoreCase(business.getId(), email)
                .orElseGet(() -> customerRepository.save(new Customer(
                        business,
                        fullName,
                        phoneNumber,
                        email,
                        address,
                        notes)));
    }

    private Lead seedLead(
            Business business,
            String customerName,
            String phoneNumber,
            String email,
            String serviceNeeded,
            String urgency,
            LeadStatus status,
            BigDecimal estimatedValue,
            String notes) {
        return leadRepository.findByBusinessIdAndPhoneNumberAndServiceNeeded(
                        business.getId(),
                        phoneNumber,
                        serviceNeeded)
                .orElseGet(() -> leadRepository.save(new Lead(
                        business,
                        customerName,
                        phoneNumber,
                        email,
                        serviceNeeded,
                        urgency,
                        status,
                        estimatedValue,
                        notes)));
    }

    private void seedCalls(
            Business business,
            Customer sarah,
            Customer marcus,
            Lead emergencyRepair,
            Lead replacementQuote,
            Lead maintenancePlan) {
        if (callRecordRepository.findByBusinessId(business.getId(), PageRequest.of(0, 1)).hasContent()) {
            return;
        }

        callRecordRepository.save(new CallRecord(
                business,
                sarah,
                null,
                sarah.getPhoneNumber(),
                CallStatus.COMPLETED,
                412,
                "Caller asked for a spring tune-up and mentioned the upstairs unit was running loudly.",
                "Scheduled a tune-up and captured concern about upstairs unit noise for the technician.",
                "Maintenance scheduling",
                "Medium",
                null));
        callRecordRepository.save(new CallRecord(
                business,
                null,
                emergencyRepair,
                emergencyRepair.getPhoneNumber(),
                CallStatus.ANSWERED_BY_AI,
                286,
                "Caller reported no cooling and asked for the earliest emergency appointment.",
                "AI qualified the emergency AC issue, collected contact details, and marked the lead urgent.",
                "Emergency repair",
                "Urgent",
                null));
        callRecordRepository.save(new CallRecord(
                business,
                marcus,
                replacementQuote,
                marcus.getPhoneNumber(),
                CallStatus.ESCALATED,
                538,
                "Caller manages a commercial property and requested a quote for replacing aging rooftop units.",
                "AI captured commercial replacement details and escalated for manager review.",
                "Commercial quote",
                "High",
                null));
        callRecordRepository.save(new CallRecord(
                business,
                null,
                maintenancePlan,
                maintenancePlan.getPhoneNumber(),
                CallStatus.VOICEMAIL,
                94,
                "Caller left a voicemail asking about annual service plan pricing.",
                "Voicemail transcribed and converted into a maintenance plan lead.",
                "Plan inquiry",
                "Medium",
                null));
        callRecordRepository.save(new CallRecord(
                business,
                null,
                null,
                "+1 512-555-0127",
                CallStatus.MISSED,
                0,
                null,
                "Missed call logged for follow-up queue.",
                "Unknown",
                "Low",
                null));
    }

    private void seedAppointments(
            Business business,
            Customer sarah,
            Customer marcus,
            Customer elena,
            Lead replacementQuote,
            Lead ductwork) {
        if (appointmentRepository.findByBusinessId(business.getId(), PageRequest.of(0, 1)).hasContent()) {
            return;
        }

        Instant now = Instant.now();
        appointmentRepository.save(new Appointment(
                business,
                sarah,
                null,
                "Spring tune-up",
                "Tune-up plus upstairs unit noise inspection.",
                now.plus(1, ChronoUnit.DAYS),
                now.plus(1, ChronoUnit.DAYS).plus(90, ChronoUnit.MINUTES),
                AppointmentStatus.SCHEDULED,
                sarah.getAddress()));
        appointmentRepository.save(new Appointment(
                business,
                marcus,
                replacementQuote,
                "Commercial replacement assessment",
                "Inspect rooftop units and prepare replacement options.",
                now.plus(2, ChronoUnit.DAYS),
                now.plus(2, ChronoUnit.DAYS).plus(2, ChronoUnit.HOURS),
                AppointmentStatus.SCHEDULED,
                marcus.getAddress()));
        appointmentRepository.save(new Appointment(
                business,
                elena,
                ductwork,
                "Ductwork inspection",
                "Evaluate airflow imbalance and duct sealing needs.",
                now.plus(4, ChronoUnit.DAYS),
                now.plus(4, ChronoUnit.DAYS).plus(75, ChronoUnit.MINUTES),
                AppointmentStatus.SCHEDULED,
                elena.getAddress()));
        appointmentRepository.save(new Appointment(
                business,
                elena,
                null,
                "Filter replacement follow-up",
                "Completed follow-up from prior maintenance visit.",
                now.minus(3, ChronoUnit.DAYS),
                now.minus(3, ChronoUnit.DAYS).plus(45, ChronoUnit.MINUTES),
                AppointmentStatus.COMPLETED,
                elena.getAddress()));
    }

    private void seedMessages(
            Business business,
            Customer sarah,
            Lead emergencyRepair,
            Lead replacementQuote) {
        if (messageRepository.findByBusinessId(business.getId(), PageRequest.of(0, 1)).hasContent()) {
            return;
        }

        Instant now = Instant.now();
        messageRepository.save(new Message(
                business,
                sarah,
                null,
                MessageDirection.OUTBOUND,
                MessageChannel.SMS,
                "Hi Sarah, Austin Prime HVAC confirmed your spring tune-up for tomorrow morning.",
                MessageStatus.SENT,
                now.minus(2, ChronoUnit.HOURS)));
        messageRepository.save(new Message(
                business,
                sarah,
                null,
                MessageDirection.INBOUND,
                MessageChannel.SMS,
                "Thanks, morning works great.",
                MessageStatus.RECEIVED,
                now.minus(110, ChronoUnit.MINUTES)));
        messageRepository.save(new Message(
                business,
                null,
                emergencyRepair,
                MessageDirection.OUTBOUND,
                MessageChannel.SMS,
                "Jordan, we received your emergency AC request. A dispatcher will follow up shortly.",
                MessageStatus.SENT,
                now.minus(48, ChronoUnit.MINUTES)));
        messageRepository.save(new Message(
                business,
                null,
                replacementQuote,
                MessageDirection.OUTBOUND,
                MessageChannel.SMS,
                "Priya, your HVAC replacement consultation is booked. Reply here if the access instructions change.",
                MessageStatus.SENT,
                now.minus(25, ChronoUnit.MINUTES)));
    }

    private void seedAiConfig(Business business) {
        aiReceptionistConfigRepository.findByBusinessId(business.getId())
                .orElseGet(() -> aiReceptionistConfigRepository.save(new AiReceptionistConfig(
                        business,
                        "Thanks for calling Austin Prime HVAC. I can help with repairs, maintenance, estimates, and scheduling.",
                        "Thanks for calling Austin Prime HVAC. We are currently closed, but I can still capture your request and alert the team.",
                        "For gas smells, electrical hazards, or medical emergencies, tell the caller to contact emergency services immediately before continuing.",
                        "Confirm the caller's name, phone number, service address, system type, urgency, and preferred appointment window before booking.",
                        "AC repair, heating repair, seasonal tune-ups, HVAC replacement estimates, indoor air quality, ductwork inspections.",
                        "+1 512-555-0199")));
    }

    private void seedTeamMember(Business business) {
        String email = demoAuthProperties.email();
        teamMemberRepository.findByBusinessIdAndEmailIgnoreCase(business.getId(), email)
                .orElseGet(() -> teamMemberRepository.save(new TeamMember(
                        business,
                        UUID.nameUUIDFromBytes(email.toLowerCase().getBytes(StandardCharsets.UTF_8)).toString(),
                        demoAuthProperties.name(),
                        email,
                        TeamMemberRole.OWNER,
                        TeamMemberStatus.ACTIVE)));
    }

    private void seedBillingPlan(Business business) {
        subscriptionPlanRepository.findByBusinessId(business.getId())
                .orElseGet(() -> {
                    Instant now = Instant.now();
                    return subscriptionPlanRepository.save(new SubscriptionPlan(
                            business,
                            "MVP Trial",
                            SubscriptionPlanStatus.TRIAL,
                            BigDecimal.ZERO,
                            now.minus(3, ChronoUnit.DAYS),
                            now.plus(11, ChronoUnit.DAYS)));
                });
    }
}
