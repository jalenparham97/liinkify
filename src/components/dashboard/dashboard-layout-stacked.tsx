"use client";

import {
  IconCreditCard,
  IconHome,
  IconLogout,
  IconMenu2,
  IconSettings,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { useAuthUser } from "@/queries/user.queries";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { NavButton } from "../ui/nav-button";
import { COMPANY_NAME } from "@/utils/constants";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const user = useAuthUser();

  async function logout() {
    await signOut({ callbackUrl: "/auth/login" });
  }

  return (
    <>
      <div className="h-full">
        <Disclosure
          as="nav"
          className="sticky top-0 z-50 border-b border-gray-200 bg-white"
        >
          {({ open }) => (
            <>
              <div className="mx-auto px-4">
                <div className="flex h-16 justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-shrink-0 items-center space-x-6">
                      {/* <Logo icon /> */}
                      <h2 className="text-lg font-medium">{COMPANY_NAME}</h2>
                    </div>
                    <div className="space-x-2">
                      <NavButton
                        href={`/dashboard`}
                        leftIcon={<IconHome size={16} />}
                      >
                        Dashboard
                      </NavButton>
                      <NavButton
                        href={`/dashboard/settings`}
                        leftIcon={<IconSettings size={16} />}
                      >
                        Settings
                      </NavButton>
                    </div>
                  </div>
                  <div className="hidden space-x-4 sm:flex sm:items-center">
                    {/* Profile dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center">
                        <span className="sr-only">Open user menu</span>
                        <Avatar>
                          <AvatarImage src={user?.image || ""} />
                          <AvatarFallback className="uppercase text-white">
                            {getInitials(user?.email, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[250px]"
                      >
                        <DropdownMenuLabel>
                          <p className="text-xs font-normal text-gray-400">
                            Signed in as
                          </p>
                          <p>{user?.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/settings`}>
                          <DropdownMenuItem>
                            <IconUserCircle className="mr-2 h-4 w-4" />
                            <span>Manage account</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/settings/subscription`}>
                          <DropdownMenuItem>
                            <IconCreditCard className="mr-2 h-4 w-4" />
                            <span>Subscription</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                          <IconLogout className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <IconX className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <IconMenu2
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {/* {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={cn(
                        item.current
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))} */}
                </div>
                {/* <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <IconBell className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div> */}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <main className="h-full">{children}</main>
      </div>
    </>
  );
}
