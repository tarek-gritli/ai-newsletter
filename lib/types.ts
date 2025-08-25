export interface UserPreferences {
  id: number;
  user_id: number;
  categories: string[];
  frequency: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface CheckoutSessionResponse {
  success: boolean;
  error?: string;
  url?: string;
}

export interface Article {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}
