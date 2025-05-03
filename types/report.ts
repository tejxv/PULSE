export interface Report {
  id: string;
  created_at: string;
  user_id: string;
  analysis: any; // You can make this more specific based on your needs
  is_urgent: boolean;
  is_bookmarked: boolean;
} 