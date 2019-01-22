import { FilesCollection } from 'meteor/ostrio:files'

const fcConfig = {
  downloadRoute: '/download'
}

export const SubtitlesFiles = new FilesCollection({
  collectionName: 'SubtitlesFiles',
  ...fcConfig
})
