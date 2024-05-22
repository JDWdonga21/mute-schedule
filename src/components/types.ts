// types.ts
export interface Event {
    id: number;
    created_at: string;
    updated_at: string;
    user_uuid: string;
    type: string;
    start_date: string;
    end_date: string | null;
    reason: string;
    description: string;
    status: number;
    create_user_uuid: string;
  }
  