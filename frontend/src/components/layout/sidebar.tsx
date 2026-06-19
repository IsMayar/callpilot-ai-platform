import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  MessageSquareText,
  PhoneCall,
  UserPlus,
  UsersRound
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard
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
  },
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
  },
  {
    title: "Business setup",
    href: "/app/onboarding/business",
    icon: Building2
  }
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
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
        <nav className="grid gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
