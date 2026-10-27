import {
  Video, ListChecks, FileText, BookOpen, Table, FolderOpen, GraduationCap,
  Book, LineChart, Compass, Presentation, Wrench, Bot, Package,
  Calculator, Coins, ScanSearch, Boxes, BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  video: Video,
  "list-checks": ListChecks,
  "file-text": FileText,
  "book-open": BookOpen,
  table: Table,
  "folder-open": FolderOpen,
  "graduation-cap": GraduationCap,
  book: Book,
  "line-chart": LineChart,
  compass: Compass,
  presentation: Presentation,
  wrench: Wrench,
  bot: Bot,
  calculator: Calculator,
  coins: Coins,
  "scan-search": ScanSearch,
  boxes: Boxes,
  "badge-check": BadgeCheck,
};

/** 线性统一风格的图标映射（lucide），名称存于 products.icon */
export function ProductIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Package;
  return <Icon className={cn("h-5 w-5", className)} strokeWidth={1.75} />;
}
