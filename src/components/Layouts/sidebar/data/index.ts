import { Gamepad, LogOut, LucideNotebookPen, LucidePiggyBank, PiggyBank, Settings, User } from "lucide-react";
import * as Icons from "../icons";

type sidebarIndex = {
  label: string;
  items: {
    title: string;
    url: string;
    icon: any;
    items: {title: string, url:string}[];
  }[];
}[];

export const NAV_DATA: sidebarIndex = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Accounts",
        url: "/accounts",
        icon: PiggyBank,
        items: [],
      },
      {
        title: "Sessions",
        url: "/sessions",
        icon: LucideNotebookPen,
        items: [],
      },
      {
        title: "Games",
        url: "/games",
        icon: Gamepad,
        items: [],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        items: [],
      },
      {
        title: "Profile",
        url: "/user",
        icon: User,
        items: [],
      },
      {
        title: "Log out",
        url: "/auth/sign-out",
        icon: LogOut,
        items: []
      }
    
    ],
  },
];
