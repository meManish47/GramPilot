"use client";

import * as React from "react";
import { Moon, MoonIcon, Sun, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <main>
      {theme === "light" ? (
        <Button onClick={() => setTheme("dark")} className="cursor-pointer">
          <MoonIcon />
        </Button>
      ) : (
        <Button onClick={() => setTheme("light")} className="cursor-pointer">
          <SunIcon />
        </Button>
      )}
    </main>
  );
}
