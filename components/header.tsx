'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { LogOut, Menu, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'
import { isAdminRole } from '@/lib/auth-role'

const menuItems = [
    { name: 'Dashboard', href: '/user/dashboard' },
    { name: 'Houses', href: '/user/houses' },
    { name: 'Prediction', href: '/user/predictions' },
    { name: 'About', href: '/user/about' },
]

const adminMenuItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Manage Users', href: '/admin/manage-users' },
    { name: 'Predictions', href: '/admin/predictions' },
    { name: 'About', href: '/admin/about' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { data: session, status } = useSession()

    const currentUser = session?.user as
        | {
              firstName?: string
              username?: string
              utype?: string
          }
        | undefined

    const isAuthenticated = status === 'authenticated'
    const dashboardHref =
        isAdminRole(currentUser?.utype) ? '/admin/dashboard' : '/user/dashboard'
    const profileHref = isAdminRole(currentUser?.utype) ? '/admin/profile' : '/user/profile'
    const navigationItems = isAdminRole(currentUser?.utype)
        ? adminMenuItems
        : menuItems
    const getProtectedHref = React.useCallback(
        (href: string) => (isAuthenticated ? href : `/login?callbackUrl=${encodeURIComponent(href)}`),
        [isAuthenticated]
    )

    const handleLogout = async () => {
        setMenuState(false)
        await signOut({ callbackUrl: '/' })
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {navigationItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={getProtectedHref(item.href)}
                                            onClick={() => setMenuState(false)}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {navigationItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={getProtectedHref(item.href)}
                                                onClick={() => setMenuState(false)}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {isAuthenticated ? (
                                    <>
                                        <Link   
                                            href={profileHref}
                                            onClick={() => setMenuState(false)}
                                            className="flex items-center justify-center gap-3 rounded-2xl border border-transparent px-2 py-1.5 text-left transition hover:border-white/10 hover:bg-muted/70 sm:justify-start"
                                        >
                                        <span className="flex size-9 items-center justify-center rounded-full bg-primary/12 text-primary">
                                            <User className="size-4" />
                                        </span>
                                        <span className="hidden sm:flex sm:flex-col">
                                            <span className="text-sm font-medium leading-none">
                                                {currentUser?.firstName ?? currentUser?.username ?? 'Profile'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                View profile
                                            </span>
                                        </span>
                                        </Link>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleLogout}
                                            className="w-full justify-center gap-2 self-center sm:w-auto sm:justify-start"
                                        >
                                            <LogOut className="size-4" />
                                            <span>Logout</span>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/login" onClick={() => setMenuState(false)}>
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/register" onClick={() => setMenuState(false)}>
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                            <Link href="/register" onClick={() => setMenuState(false)}>
                                                <span>Get Started</span>
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
