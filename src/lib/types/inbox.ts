import { Thread } from "./thread"

export enum InboxSubCategory {
   NeedsAttention = "Needs Attention",
   Unread = "Unread",
   EverythingElse = "Everything Else",
}
export type InboxCategory = {
   unreadCount: number
   subcategories: Record<InboxSubCategory, Thread[]>
}
export type InboxCategories = Record<string, InboxCategory>
export type Inbox = {
   unreadCount: number
   categories: InboxCategories
   categoryOrder: string[]
}
