import darkLogo from "@/assets/logos/logo-dark-new.svg";
import logo from "@/assets/logos/logo-new.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="pt-4 pr-4">
      <Image
        src={logo}
        // fill
        className="!position-[unset] dark:hidden"
        alt="Poker Bankroll logo"
        role="presentation"
        // quality={100}
        // height={1200}
        // width={1200}
      />

      <Image
        src={darkLogo}
        className="!position-[unset] hidden dark:block"
        alt="Poker Bankroll logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
