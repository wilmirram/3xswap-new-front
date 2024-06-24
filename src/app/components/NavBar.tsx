import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "hooks";
import { getSupportedLanguagesAsString } from "../state/i18nSlice";

import { i18nSlice } from "../state/i18nSlice";

import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { isMobile } from "../utils";

interface NavbarItemProps {
  title: string;
  target: string;
}
interface NavbarItemMobileProps extends NavbarItemProps {
  setMenuOpen: (newMenuOpenState: boolean) => void;
}

const NavItems: { path: string; title: string }[] = [
  {
    path: "/#",
    title: "Home",
  },
  {
    path: "/trade",
    title: "Trade",
  },
  {
    path: "/rewards",
    title: "Rewards",
  },
  {
    path: "/perfil",
    title: "Perfil",
  },
];

export function Navbar() {
  return (
    <nav className="flex items-center justify-between w-full !h-[74px] !min-h-[124px] z-[100] pl-80 pr-80"> {/* Adicionando padding-left */}
      <div className="flex items-center h-full flex-1 justify-start"> {/* Ajuste aqui */}
        <Logo />
        <NavbarItemsDesktop />
      </div>
      <div className="flex items-center content-center">
        <div className="flex pr-4">
          <HideOnSmallScreens>
            <LanguageSelection />
          </HideOnSmallScreens>
          <radix-connect-button
            style={{
              width: '140px',
              borderRadius: '610px',
            }}
            status="default"
            theme="radix-blue"
          >
          </radix-connect-button>
        </div>
        <HamburgerMenu />
      </div>
    </nav>
  );
}

// Responsive logo component for the navbar
//  > 420px : show full logo and lettering
// <= 420px : show only logo
function Logo() {
  return (
    <>
      <Link className="flex justify-center items-center" href="/">
        <Image
          src="/3xlogo-white-g.png"
          alt="3Xswap logo"
          width={130}
          height={130}
          className="!my-0 w-40 mx-0 hidden min-[350px]:block"
          priority={true}
        />
        <Image
          src="/3xlogo-white-g.png"
          alt="3Xswap logo"
          width={30}
          height={30}
          className="!my-0 mx-0 min-[420px]:hidden"
          priority={true}
        />
      </Link>
    </>
  );
}

function NavbarItemsDesktop() {
  return (
    <>
      <div className="hidden sm:flex h-full items-center px-12 mx-12 z-50 justify-start text-dexter-gradient-blue"> {/* Ajuste aqui */}
        {NavItems.map((navItem, indx) => {
          return (
            <NavbarItemDesktop
              title={navItem.title}
              target={navItem.path}
              key={indx}
            />
          );
        })}
      </div>
    </>
  );
}

function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="sm:hidden flex justify-center items-center mr-6 ml-40">
      <button onClick={() => setMenuOpen(true)}>
        <Image
          src="/hamburger-icon.svg"
          alt="menu"
          width="32"
          height="32"
          className="h-auto color-white"
        />
      </button>
      {menuOpen && <MobileMenu setMenuOpen={setMenuOpen} />}
    </div>
  );
}

function MobileMenu({
  setMenuOpen,
}: {
  setMenuOpen: (newMenuOpen: boolean) => void;
}) {
  return (
    <div
      className={`flex flex-col items-end w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.8)] overflow-hidden z-[1000] fixed top-0 left-0 backdrop-blur-lg py-5 ${isMobile() ? "px-6" : "px-10"
        }`}
    >
      {/* Close Menu Button */}
      <button onClick={() => setMenuOpen(false)}>
        <Image
          src="/close-x.svg"
          alt="menu"
          width="32"
          height="32"
          className="h-auto color-white opacity-70"
        />
      </button>
      {/* Navbar Items */}
      <div className="mt-10 w-full">
        {NavItems.map((navItem, indx) => {
          return (
            <NavbarItemMobile
              title={navItem.title}
              target={navItem.path}
              setMenuOpen={setMenuOpen}
              key={indx}
            />
          );
        })}
      </div>
      {/* Language Selection */}
      <div className="w-full flex flex-col items-center justify-center">
        <h3 className="w-full text-center text-secondary-content font-light text-base">
          Language Selection
        </h3>
        <LanguageSelection />
      </div>
    </div>
  );
}

function NavbarItemDesktop({ title, target }: NavbarItemProps) {
  const active = target === usePathname();
  return (
    <Link
      className={`h-full flex items-center px-8 hover:!no-underline hover:text-accent mb-0 ${active ? "border-b-2 border-[#cafc40]" : ""
        }`}
      href={target}
    >
      <p className={`text-sm ${active ? "text-[#cafc40]" : "text-dexter-gradient-blue"}`}>
        {title}
      </p>
    </Link>
  );
}

function NavbarItemMobile({
  title,
  target,
  setMenuOpen,
}: NavbarItemMobileProps) {
  const active = target === usePathname();
  return (
    <Link
      className={`my-2 hover:!no-underline`}
      href={target}
      onClick={() => setMenuOpen(false)}
    >
      <p
        className={`text-2xl text-center py-4 ${active ? "text-[#cafc40]" : "text-white"
          }`}
      >
        {title}
      </p>
    </Link>
  );
}

function LanguageSelection() {
  const dispatch = useAppDispatch();
  const supportedLanguagesStr = useSelector(getSupportedLanguagesAsString);
  const supportedLanguages = supportedLanguagesStr.split(",");
  let { language } = useAppSelector((state) => state.i18n);

  const handleLanguageChange = (lang: string) => {
    dispatch(i18nSlice.actions.changeLanguage(lang.toLowerCase()));
    Cookies.set("userLanguage", lang, { expires: 365, partitioned: true }); // Set a cookie for 1 year
  };

  return (
    <div className="mr-4 flex">
      {supportedLanguages.map((lang) => (
        <button
          className={`uppercase py-2 px-2 sm:px-1 text-xl sm:text-sm ${language === lang ? "font-extrabold" : "font-extralight"
            }`}
          key={lang}
          onClick={() => handleLanguageChange(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

function HideOnSmallScreens({ children }: { children: React.ReactNode }) {
  return <div className="hidden sm:flex">{children}</div>;
}
