import { Mongo } from 'meteor/mongo'

export const TvWatch = new Mongo.Collection('show_watch')
export const WatchLaterTv = new Mongo.Collection('watch_later_tv')
export const SavedTvShow = new Mongo.Collection('saved_tv_show')
