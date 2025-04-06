import { Link } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site.ts";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="lg" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            to="/"
          >
            <Logo />
            <p className="font-bold text-inherit">MichitaLab</p>
          </Link>
        </NavbarBrand>
        <ul className="flex gap-6 ml-4">
          {siteConfig.navItems.map((item)=> (
            <NavbarItem key={item.href}>
              <Link
                className="data-[active=true]:text-primary hover:text-primary-500"
                color="foreground"
                to={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};
