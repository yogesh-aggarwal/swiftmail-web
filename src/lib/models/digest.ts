import { digestsStore } from "../state"
import { Model } from "./model"

export type Digest = {
   id: string
   userId: string
   dateCreated: number
   dateUpdated: number
   title: string
   description: string
}

class _DigestDB extends Model<Digest> {
   constructor() {
      super({
         collection: "digests",
         store: digestsStore,
      })
   }
}

export const DigestDB = new _DigestDB()
