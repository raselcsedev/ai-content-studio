"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Code2,
  ImageIcon,
  History,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Generator",
    href: "/dashboard/blog-generator",
    icon: FileText,
  },
  {
    title: "Email Writer",
    href: "/dashboard/email-writer",
    icon: Mail,
  },
  {
    title: "Code Assistant",
    href: "/dashboard/code-assistant",
    icon: Code2,
  },
  {
    title: "Image Prompts",
    href: "/dashboard/image-prompts",
    icon: ImageIcon,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle, isMobile, setOpen, setMobile } = useSidebarStore();

  useEffect(() => {
    const updateSize = () => setMobile(window.innerWidth < 1024);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [setMobile]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-card transition-all duration-300",
          isOpen ? "w-64" : "w-[70px]",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-bold gradient-text">AI Content</span>
              <span className="text-xs text-muted-foreground">Studio</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                const linkContent = (
                  <Link
                    href={item.href}
                    onClick={() => isMobile && setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      !isOpen && "justify-center px-2"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-primary" : ""
                      )}
                    />
                    {isOpen && <span>{item.title}</span>}
                    {isActive && isOpen && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );

                if (!isOpen && !isMobile) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <React.Fragment key={item.href}>
                    {linkContent}
                  </React.Fragment>
                );
              })}
            </TooltipProvider>
          </nav>
        </ScrollArea>

        {/* Collapse button */}
        {!isMobile && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={toggle}
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
