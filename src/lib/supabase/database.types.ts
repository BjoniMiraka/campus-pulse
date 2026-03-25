export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          anonymous_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          anonymous_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          anonymous_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          content: string
          author_id: string
          type: 'confession' | 'hot-take' | 'question'
          reactions: {
            fire: number
            skull: number
            laugh: number
            eyes: number
          }
          comment_count: number
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          author_id: string
          type: 'confession' | 'hot-take' | 'question'
          reactions?: {
            fire: number
            skull: number
            laugh: number
            eyes: number
          }
          comment_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          author_id?: string
          type?: 'confession' | 'hot-take' | 'question'
          reactions?: {
            fire: number
            skull: number
            laugh: number
            eyes: number
          }
          comment_count?: number
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      daily_polls: {
        Row: {
          id: string
          question: string
          option_a: string
          option_b: string
          votes_a: number
          votes_b: number
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          question: string
          option_a: string
          option_b: string
          votes_a?: number
          votes_b?: number
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          question?: string
          option_a?: string
          option_b?: string
          votes_a?: number
          votes_b?: number
          created_at?: string
          expires_at?: string
        }
      }
      poll_votes: {
        Row: {
          id: string
          poll_id: string
          user_id: string
          option: 'A' | 'B'
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          user_id: string
          option: 'A' | 'B'
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string
          option?: 'A' | 'B'
          created_at?: string
        }
      }
      user_reactions: {
        Row: {
          id: string
          post_id: string
          user_id: string
          reaction_type: 'fire' | 'skull' | 'laugh' | 'eyes'
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          reaction_type: 'fire' | 'skull' | 'laugh' | 'eyes'
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          reaction_type?: 'fire' | 'skull' | 'laugh' | 'eyes'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
