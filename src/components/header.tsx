
'use client';

import { Droplets, LogIn, UserPlus, Home, BarChart2, Globe } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';


export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (locale: string) => {
    const newPath = `/${locale}${pathname.startsWith('/en') || pathname.startsWith('/hi') ? pathname.substring(3) : pathname}`;
    router.replace(newPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              Hydronix
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                  <Link href="/"><Home className="mr-2"/> Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/assessment"><BarChart2 className="mr-2"/> Result</Link>
              </Button>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
            <div className="hidden md:flex">
                <Button variant="ghost" asChild>
                    <Link href="/login"><LogIn className="mr-2"/> Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup"><UserPlus className="mr-2"/> Sign Up</Link>
                </Button>
            </div>
            <ModeToggle />
        </div>
      </div>
    </header>
  );
}
