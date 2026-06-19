import { Bell, LogOut, Menu, UserRound } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { clearCredentials, selectAuthUser } from "@/features/auth/authSlice";

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector(selectAuthUser);
  const fallback = user?.name?.slice(0, 2).toUpperCase() ?? "CP";
  const title = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            Workspace
          </p>
          <h1 className="truncate text-lg font-semibold">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Alerts">
          <Bell className="size-5" aria-hidden="true" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-10 gap-2 px-2"
              aria-label="Account menu"
            >
              <Avatar className="size-8">
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <UserRound className="size-4" aria-hidden="true" />
              <span className="truncate">{user?.email ?? "Account"}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => dispatch(clearCredentials())}>
              <LogOut className="mr-2 size-4" aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.includes("/onboarding/business")) {
    return "Business onboarding";
  }

  if (pathname.includes("/leads")) {
    return "Leads";
  }

  return "Dashboard";
}
