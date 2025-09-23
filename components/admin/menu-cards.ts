import { MousePointerClick, Dices, FileText } from "lucide-react";

export const menuCards = [
  {
    name: "Seleccionar jugadores",
    icon: MousePointerClick,
    url: "/admin/seleccion",
    bgColor: "bg-blue-100",
    hoverBgColor: "group-hover:bg-blue-200",
    iconColor: "text-blue-600",
    borderHoverColor: "hover:border-red-400 border-2",
  },
  {
    name: "Sortear capitanías",
    icon: Dices,
    url: "/admin/sorteo",
    bgColor: "bg-green-100",
    hoverBgColor: "group-hover:bg-green-200",
    iconColor: "text-green-600",
    borderHoverColor: "hover:border-red-400 border-2",
  },
  {
    name: "Informes",
    icon: FileText,
    url: "/admin/informes",
    bgColor: "bg-purple-100",
    hoverBgColor: "group-hover:bg-purple-200",
    iconColor: "text-purple-600",
    borderHoverColor: "hover:border-red-400 border-2",
  },
];