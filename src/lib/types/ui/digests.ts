import { Thread } from "../models/thread"

export enum DigestSubCategory {
   NeedsAttention = "Needs Attention",
   Unread = "Unread",
   EverythingElse = "Everything Else",
}

export type DigestData = {
   id: string
   name: string
   description: string
   unreadCount: number
   threads: Thread[]
}

export type Digest = {
   unreadCount: number
   digests: Record<string, DigestData>
}
