import {
  Gamepad,
  LogOut,
  LucideList,
  LucideNotebookPen,
  LucidePiggyBank,
  PiggyBank,
  Settings,
  TestTube,
  User,
} from "lucide-react";
import * as Icons from "../icons";

type sidebarIndex = {
  label: string;
  items: {
    title: string;
    url: string;
    icon: any;
    items: { title: string; url: string }[];
  }[];
}[];

export const NAV_DATA: sidebarIndex = [
  {
    label: "Bankroll",
    items: [
      {
        title: "Home",
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
        title: "Categories",
        url: "/categories",
        icon: LucideList,
        items: [],
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "General",
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
        items: [],
      },
      
    ],
  },
];
