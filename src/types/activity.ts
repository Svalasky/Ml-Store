export type ActivityType =
  | "task"
  | "note"
  | "finance"
  | "schedule"
  | "bookmark";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: string;
}
