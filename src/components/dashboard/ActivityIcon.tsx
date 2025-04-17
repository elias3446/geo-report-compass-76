
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  Users,
  Edit,
  FilePlus,
  FilePen,
  FileX,
  UserPlus,
  UserX,
  User,
  Settings,
  Tag
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ActivityIconProps {
  type: string;
  className?: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ type, className = "h-4 w-4" }) => {
  const iconProps = { className };
  
  switch (type) {
    case "report_created":
      return <FilePlus {...iconProps} className={`${className} text-blue-500`} />;
    case "report_updated":
      return <FilePen {...iconProps} className={`${className} text-yellow-500`} />;
    case "report_resolved":
      return <CheckCircle2 {...iconProps} className={`${className} text-green-500`} />;
    case "report_deleted":
      return <FileX {...iconProps} className={`${className} text-red-500`} />;
    case "report_assigned":
      return <Users {...iconProps} className={`${className} text-purple-500`} />;
    case "report_status_changed":
      return <Clock {...iconProps} className={`${className} text-orange-500`} />;
    case "user_created":
      return <UserPlus {...iconProps} className={`${className} text-green-500`} />;
    case "user_updated":
      return <User {...iconProps} className={`${className} text-blue-500`} />;
    case "user_deleted":
      return <UserX {...iconProps} className={`${className} text-red-500`} />;
    case "category_created":
      return <Tag {...iconProps} className={`${className} text-green-500`} />;
    case "category_updated":
      return <Tag {...iconProps} className={`${className} text-blue-500`} />;
    case "category_deleted":
      return <Tag {...iconProps} className={`${className} text-red-500`} />;
    case "setting_updated":
      return <Settings {...iconProps} className={`${className} text-indigo-500`} />;
    case "priority_changed":
      return <AlertCircle {...iconProps} className={`${className} text-orange-500`} />;
    case "category_changed":
      return <Edit {...iconProps} className={`${className} text-indigo-500`} />;
    case "location_changed":
      return <MapPin {...iconProps} className={`${className} text-pink-500`} />;
    default:
      return <FileText {...iconProps} className={`${className} text-gray-500`} />;
  }
};

