// types.ts
export interface Event {
  id: number;
  created_at: Date;
  updated_at: Date;
  user_uuid: string;
  type: string;
  start_date: Date;
  end_date: Date | null;
  reason: string;
  description: string;
  status: number;
  create_user_uuid: string;
}
