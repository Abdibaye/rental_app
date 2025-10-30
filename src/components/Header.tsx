"use client"
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/theme'
import React from 'react'
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
} from '@/components/ui/resizable-navbar'

const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'Eligibility', href: '/eligibility' },
        { name: 'How It Works', href: '#how-it-works' },
]

export const HeroHeader = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    return (
        <header className="relative z-40">
            <Navbar>
                {/* Desktop navbar */}
                <NavBody>
                    <Link href="/" aria-label="home" className="flex items-center gap-2">
                        <Image src="/home-button.png" alt="Home" width={24} height={24} className="rounded" />
                        <span className="text-xl font-extrabold tracking-tight">StateRent Assistance</span>
                    </Link>
                    <NavItems items={menuItems.map((m) => ({ name: m.name, link: m.href }))} />
                    <div className="flex items-center gap-3">
                        <Button asChild size="sm">
                            <Link href="#apply">Apply Now</Link>
                        </Button>
                        <span className="mr-2.5">
                            <ThemeToggle />
                        </span>
                    </div>
                </NavBody>

                {/* Mobile navbar */}
                <MobileNav>
                    <MobileNavHeader>
                        <Link href="/" aria-label="home" className="flex items-center gap-2">
                            <Image src="/home-button.png" alt="Home" width={24} height={24} className="rounded" />
                            <span className="text-base font-semibold tracking-tight">Rent Assistance</span>
                        </Link>
                        <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
                    </MobileNavHeader>
                    <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
                        <nav className="flex w-full flex-col gap-2">
                            {menuItems.map((m) => (
                                <Link
                                    key={m.name}
                                    href={m.href}
                                    className="rounded-md px-2 py-2 text-base text-foreground/90 hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {m.name}
                                </Link>
                            ))}
                            <div className="mt-2 flex items-center gap-3">
                                <Button asChild size="sm">
                                    <Link href="#apply">Apply Now</Link>
                                </Button>
                                <ThemeToggle />
                            </div>
                        </nav>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </header>
    )
}