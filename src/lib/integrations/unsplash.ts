import { RestAPI } from "../core/api/rest"
import { UNSPLASH_CLIENT_ID } from "../core/constants"
import { Logger } from "../core/logging/logger"
import { UnsplashPhoto_t, UnsplashSearchResult_t } from "./unsplash.types"

export class _Unsplash {
   readonly api: RestAPI
   readonly baseURI: string = "https://api.unsplash.com"

   readonly MAX_RESULTS_PER_PAGE = 30

   constructor() {
      this.api = new RestAPI(
         this.baseURI,
         {
            Authorization: `Client-ID ${UNSPLASH_CLIENT_ID}`,
         },
         new Logger("Unsplash")
      )
   }

   async searchPhotos(query: string, nPages: number = 2): Promise<UnsplashPhoto_t[]> {
      const jobs = []
      for (let i = 0; i < nPages; i++) {
         const job = this.api.request<UnsplashSearchResult_t>({
            url: this.api.buildURL("/search/photos", {
               query,
               per_page: 30,
               page: i + 1,
            }),
         })
         jobs.push(job)
      }

      const responses = await Promise.all(jobs)
      const results = responses
         .map((x) => x[0])
         .filter((x) => x != null)
         .map((x) => x.data.results)
         .flat()
      return results
   }
}

export const Unsplash = new _Unsplash()
