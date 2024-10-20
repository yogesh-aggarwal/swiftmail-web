export type UnsplashUser_t = {
   id: string
   username: string
   name: string
   first_name: string
   last_name: string
   twitter_username: string | null
   portfolio_url: string | null
   bio: string | null
   location: string | null
   links: {
      self: string
      html: string
      photos: string
      likes: string
      portfolio: string | null
      following: string
      followers: string
   }
   profile_image: {
      small: string
      medium: string
      large: string
   }
   instagram_username: string | null
   total_collections: number
   total_likes: number
   total_photos: number
   accepted_tos: boolean
}

export type UnsplashPhoto_t = {
   id: string
   created_at: string
   updated_at: string
   width: number
   height: number
   color: string
   description: string | null
   alt_description: string | null
   urls: {
      raw: string
      full: string
      regular: string
      small: string
      thumb: string
   }
   links: {
      self: string
      html: string
      download: string
   }
   categories: string[] | null
   likes: number
   liked_by_user: boolean
   user: UnsplashUser_t
}

export type UnsplashSearchResult_t = {
   total: number
   total_pages: number
   results: UnsplashPhoto_t[]
}
