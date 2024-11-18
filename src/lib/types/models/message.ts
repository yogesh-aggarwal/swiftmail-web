// Email Data type
export interface MessageEmailData {
   message_id: string
   thread_id: string
   from_email: string
   to_email: string
   cc_email: string
   bcc_email: string
   subject: string
   html_content: string
}

// Message Reminders type
export interface MessageReminders {
   follow_up: string[]
   forgetting: string[]
   snoozed: string[]
}

// Main Message type
export interface Message {
   id: string
   user_id: string
   date_updated: number
   date_created: number
   reminders: MessageReminders
   email_data: MessageEmailData
   thread_id: string
   summary: string
   embedding: number[]
   keywords: string[]
   unsubscribe_link: string | null
}
