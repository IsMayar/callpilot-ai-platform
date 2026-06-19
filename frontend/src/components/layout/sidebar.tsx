import {
  Bot,
  Building2,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  PhoneCall,
  Settings,
  UserCog,
  UserPlus,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Workspace",
    items: [
      {
        title: "Dashboard",
        href: "/app/dashboard",
        icon: LayoutDashboard,
        exact: true
      },
      {
        title: "Leads",
        href: "/app/leads",
        icon: UserPlus
      },
      {
        title: "Customers",
        href: "/app/customers",
        icon: UsersRound
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        title: "Calls",
        href: "/app/calls",
        icon: PhoneCall
      },
      {
        title: "Appointments",
        href: "/app/appointments",
        icon: CalendarDays
      },
      {
        title: "Messages",
        href: "/app/messages",
        icon: MessageSquareText
      }
    ]
  },
  {
    title: "Admin",
    items: [
      {
        title: "AI Settings",
        href: "/app/ai-settings",
        icon: Bot
      },
      {
        title: "Team",
        href: "/app/team",
        icon: UserCog
      },
      {
        title: "Billing",
        href: "/app/billing",
        icon: CreditCard
      },
      {
        title: "Settings",
        href: "/app/settings",
        icon: Settings
      },
      {
        title: "Business setup",
        href: "/app/onboarding/business",
        icon: Building2
      }
    ]
  }
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn("flex min-h-0 flex-col bg-sidebar", className)}>
      <div className="flex h-16 shrink-0 items-center gap-3 px-4">
        <Link
          to="/app/dashboard"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-3"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            CP
          </span>
          <span className="truncate text-base font-semibold text-sidebar-foreground">
            CallPilot AI
          </span>
        </Link>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <nav className="grid gap-5 p-3">
          {navSections.map((section) => (
            <div key={section.title} className="grid gap-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                {section.title}
              </p>
              {section.items.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.href
                  : location.pathname === item.href ||
                    location.pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
