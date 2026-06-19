import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { AiReceptionistSettingsPage } from "@/pages/ai-receptionist-settings-page";
import { AppointmentsPage } from "@/pages/appointments-page";
import { BillingPage } from "@/pages/billing-page";
import { BusinessOnboardingPage } from "@/pages/business-onboarding-page";
import { CallDetailsPage } from "@/pages/call-details-page";
import { CallsPage } from "@/pages/calls-page";
import { CustomerDetailsPage } from "@/pages/customer-details-page";
import { CustomersPage } from "@/pages/customers-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { LeadDetailsPage } from "@/pages/lead-details-page";
import { LeadsPage } from "@/pages/leads-page";
import { MessagesPage } from "@/pages/messages-page";
import { LoginPage } from "@/pages/login-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { SettingsPage } from "@/pages/settings-page";
import { TeamPage } from "@/pages/team-page";
import { ProtectedRoute } from "./protected-route";
import { PublicOnlyRoute } from "./public-only-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app/dashboard" replace />
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/auth/login",
        element: <LoginPage />
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/dashboard" replace />
          },
          {
            path: "dashboard",
            element: <DashboardPage />
          },
          {
            path: "leads",
            element: <LeadsPage />
          },
          {
            path: "leads/:id",
            element: <LeadDetailsPage />
          },
          {
            path: "customers",
            element: <CustomersPage />
          },
          {
            path: "customers/:id",
            element: <CustomerDetailsPage />
          },
          {
            path: "calls",
            element: <CallsPage />
          },
          {
            path: "calls/:id",
            element: <CallDetailsPage />
          },
          {
            path: "appointments",
            element: <AppointmentsPage />
          },
          {
            path: "messages",
            element: <MessagesPage />
          },
          {
            path: "ai-settings",
            element: <AiReceptionistSettingsPage />
          },
          {
            path: "team",
            element: <TeamPage />
          },
          {
            path: "billing",
            element: <BillingPage />
          },
          {
            path: "settings",
            element: <SettingsPage />
          },
          {
            path: "onboarding/business",
            element: <BusinessOnboardingPage />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);
