"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function DashboardTour() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Only trigger on the main dashboard page
    if (pathname !== "/dashboard") return;

    const hasSeenTour = localStorage.getItem("vector_has_seen_tour");
    
    if (!hasSeenTour) {
      // Small timeout to allow layout shifts to settle (e.g., sidebar animating in)
      const timer = setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          animate: true,
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          doneBtnText: 'Finish',
          nextBtnText: 'Next →',
          prevBtnText: '← Back',
          steps: [
            {
              element: '#dashboard-main-content',
              popover: {
                title: 'Welcome to Vector OS',
                description: 'This is your central command center. Here you can get a quick glance at all your active tasks, pending deadlines, and general progress.',
                side: "left",
                align: 'start'
              }
            },
            {
              element: '#tour-link-tasks',
              popover: {
                title: 'Task Management',
                description: 'Click here to access your full task list. You can create, organize, and check off your assignments to stay on top of your workload.',
                side: "right",
                align: 'start'
              }
            },
            {
              element: '#tour-link-calendar',
              popover: {
                title: 'Your Calendar',
                description: 'Plan your days visually. All your task deadlines will automatically appear here to help you manage your time effectively.',
                side: "right",
                align: 'start'
              }
            },
            {
              element: '#tour-link-settings',
              popover: {
                title: 'Settings & Profile',
                description: 'Update your profile, change your avatar, and manage your account preferences from the settings page.',
                side: "right",
                align: 'start'
              }
            },
            {
              popover: {
                title: '<div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg> Vector OS</div>',
                description: 'Once again, welcome aboard! Enjoy exploring your new workspace. You can always collapse the sidebar for more screen real estate.',
              }
            }
          ],
          onDestroyStarted: () => {
            if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
              localStorage.setItem("vector_has_seen_tour", "true");
              driverObj.destroy();
            }
          },
        });

        driverObj.drive();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pathname, mounted]);

  return null;
}
