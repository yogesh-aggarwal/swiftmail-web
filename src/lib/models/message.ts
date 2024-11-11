export type MessageEmailData = {
   subject: string
   html_content: string
   message_id: string
   thread_id: string
   from_email: string
   to_email: string
   cc_email: string
   bcc_email: string
}

export type MessageFlags = {
   is_archived: boolean
   is_starred: boolean
   is_trash: boolean
   is_draft: boolean
   is_sent: boolean
   is_received: boolean
   is_read: boolean
   is_unread: boolean
   is_deleted: boolean
   is_junk: boolean
   is_spam: boolean
}

export type MessageReminders = {
   follow_up: string[]
   forgetting: string[]
   snoozed: string[]
}

export type Message = {
   id: string
   user_id: string
   date_updated: number
   date_created: number
   flags: MessageFlags
   reminders: MessageReminders
   email_data: MessageEmailData
   summary: string
   template?: string | null
   priorities: string[]
   categories: string[]
   labels: string[]
   digests: string[]
}
