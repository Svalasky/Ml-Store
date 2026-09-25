export type WidgetId =
  | "finance"
  | "tasks"
  | "notes"
  | "schedule"
  | "weather"
  | "bookmarks"
  | "activity";

export interface DashboardWidget {
  id: WidgetId;
  enabled: boolean;
  order: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "schedule" | "task" | "finance" | "system";
}
