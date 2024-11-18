export type UserMetadata = {
   last_seen: number
   date_created: number
   date_updated: number
}

export type UserOAuthCredentials = {
   access_token: string
   refresh_token: string
}

export type UserCredentials = {
   google_oauth: UserOAuthCredentials | null
}

export type UserAIPreferences = {
   model: string
   custom_rules: string[]
   self_description: string
}

export type UserInboxPreferences = {
   priorities: string[]
   priority_rules: string[]
   labels: string[]
   label_rules: string[]
   categories: string[]
   category_rules: string[]
   spam_words: string[]
   spam_rules: string[]
   unsubscribe_words: string[]
   unsubscribe_rules: string[]
}

export type UserPreferences = {
   ai: UserAIPreferences
   inbox: UserInboxPreferences
}

export type UserData = {
   preferences: UserPreferences
}

export type User = {
   id: string
   metadata: UserMetadata
   dp: string
   email: string
   name: string
   data: UserData
   credentials: UserCredentials
}
