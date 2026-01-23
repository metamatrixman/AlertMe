import React from "react";
import { Icon as Iconify } from "@iconify/react";

function toKebab(name: string) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function makeComponent(name: string, collection = "lucide") {
  const id = `${collection}:${toKebab(name)}`;
  const Comp = (props: any) => <Iconify icon={id} {...props} />;
  return Comp;
}

// List of named icons used throughout the app (exports preserve existing imports)
export const ArrowLeft = makeComponent("ArrowLeft");
export const ChevronDown = makeComponent("ChevronDown");
export const ChevronUp = makeComponent("ChevronUp");
export const Delete = makeComponent("Delete");
export const Home = makeComponent("Home");
export const AlertCircle = makeComponent("AlertCircle");
export const CreditCard = makeComponent("CreditCard");
export const Calculator = makeComponent("Calculator");
export const Palette = makeComponent("Palette");
export const Check = makeComponent("Check");
export const Share2 = makeComponent("Share2");
export const Download = makeComponent("Download");
export const Copy = makeComponent("Copy");
export const ArrowUpDown = makeComponent("ArrowUpDown");
export const TrendingUp = makeComponent("TrendingUp");
export const TrendingDown = makeComponent("TrendingDown");
export const Globe = makeComponent("Globe");
export const Smartphone = makeComponent("Smartphone");
export const Building2 = makeComponent("Building2");
export const Plus = makeComponent("Plus");
export const CheckCircle = makeComponent("CheckCircle");
export const XCircle = makeComponent("XCircle");
export const Sparkles = makeComponent("Sparkles");
export const Shield = makeComponent("Shield");
export const Receipt = makeComponent("Receipt");
export const Clock = makeComponent("Clock");
export const CheckCircle2 = makeComponent("CheckCircle2");
export const Eye = makeComponent("Eye");
export const EyeOff = makeComponent("EyeOff");
export const ChevronRight = makeComponent("ChevronRight");
export const X = makeComponent("X");
export const Menu = makeComponent("Menu");
export const MoreHorizontal = makeComponent("MoreHorizontal");
export const Mail = makeComponent("Mail");
export const ArrowDownToLine = makeComponent("ArrowDownToLine");
export const ArrowUpFromLine = makeComponent("ArrowUpFromLine");
export const Crown = makeComponent("Crown");
export const Star = makeComponent("Star");
export const Zap = makeComponent("Zap");
export const Camera = makeComponent("Camera");
export const Edit = makeComponent("Edit");
export const Save = makeComponent("Save");
export const MapPin = makeComponent("MapPin");
export const QrCode = makeComponent("QrCode");
export const Search = makeComponent("Search");
export const Filter = makeComponent("Filter");
export const Share = makeComponent("Share");
export const Send = makeComponent("Send");
export const Settings = makeComponent("Settings");
export const Trash2 = makeComponent("Trash2");
export const Lock = makeComponent("Lock");
export const Unlock = makeComponent("Unlock");
export const Loader2 = makeComponent("Loader2");
export const User = makeComponent("User");
export const DollarSign = makeComponent("DollarSign");
export const Calendar = makeComponent("Calendar");
export const Wifi = makeComponent("Wifi");
export const Tv = makeComponent("Tv");
export const Phone = makeComponent("Phone");
export const Car = makeComponent("Car");
export const MessageCircle = makeComponent("MessageCircle");
export const MessageSquare = makeComponent("MessageSquare");
export const Bell = makeComponent("Bell");
export const FileText = makeComponent("FileText");
export const ClipboardList = makeComponent("ClipboardList");
export const ArrowLeftRight = makeComponent("ArrowLeftRight");
export const Activity = makeComponent("Activity");
export const PiggyBank = makeComponent("PiggyBank");
export const Network = makeComponent("Network");
export const Users = makeComponent("Users");
export const HelpCircle = makeComponent("HelpCircle");
export const Archive = makeComponent("Archive");
export const Wallet = makeComponent("Wallet");
export const RefreshCw = makeComponent("RefreshCw");
export const Upload = makeComponent("Upload");
export const ChevronLeft = makeComponent("ChevronLeft");

// Heroicons used by components/ui/heroicons.tsx
export const HomeIcon = makeComponent("HomeIcon", "heroicons-solid");
export const UserIcon = makeComponent("UserIcon", "heroicons-solid");
export const CogIcon = makeComponent("CogIcon", "heroicons-solid");
export const InboxIcon = makeComponent("InboxIcon", "heroicons-solid");
export const CreditCardIcon = makeComponent("CreditCardIcon", "heroicons-solid");

// Default export for any dynamic access
const All = {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Delete,
  Home,
  AlertCircle,
  CreditCard,
  Calculator,
  Palette,
  Check,
  Share2,
  Download,
  Copy,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Building2,
  Plus,
  CheckCircle,
  XCircle,
  Sparkles,
  Shield,
  Receipt,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronRight,
  X,
  Menu,
  MoreHorizontal,
  Mail,
  ArrowDownToLine,
  ArrowUpFromLine,
  Crown,
  Star,
  Zap,
  Camera,
  Edit,
  Save,
  MapPin,
  QrCode,
  Search,
  Filter,
  Share,
  Send,
  Settings,
  Trash2,
  Lock,
  Unlock,
  Loader2,
  User,
  DollarSign,
  Calendar,
  Wifi,
  Tv,
  Phone,
  Car,
  MessageCircle,
  MessageSquare,
  Bell,
  FileText,
  ClipboardList,
  ArrowLeftRight,
  Activity,
  PiggyBank,
  Network,
  Users,
  HelpCircle,
  Archive,
  Wallet,
  RefreshCw,
  Upload,
  ChevronLeft,
  HomeIcon,
  UserIcon,
  CogIcon,
  InboxIcon,
  CreditCardIcon,
};

export default All;
