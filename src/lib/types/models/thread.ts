export type ThreadFlags = {
   is_muted: boolean
   is_read: boolean
   is_starred: boolean
   is_archived: boolean
   is_spam: boolean
   is_trash: boolean
   is_sent: boolean
}

export type Thread = {
   id: string
   user_id: string
   date_updated: number
   date_created: number
   title: string
   description: string
   summary: string
   thread_id: string
   flags: ThreadFlags
   priority: string
   categories: string[]
   labels: string[]
   digests: string[]
}
