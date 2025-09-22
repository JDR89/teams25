import { UserPlus, Bot, Edit, BotMessageSquare, Crown } from "lucide-react";

export const menuItems = [
  {
    name: "Agregar jugadores",
    icon: UserPlus,
    url: "/admin/agregar-jugador",
  },
  {
    name: "Editar jugadores",
    icon: Edit,
    url: "/admin/editar-jugador",
  },
   {
    name: "Agregar bot",
    icon: Bot,
    url: "/admin/agregar-bot",
  },
  {
    name: "Editar bot",
    icon: BotMessageSquare,
    url: "/admin/editar-bot",    
  },
   {
    name: "Ir a capitan",
    icon: Crown,
    url: "/capitan",    
  },
];