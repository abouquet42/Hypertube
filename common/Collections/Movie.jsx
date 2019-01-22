import { Mongo } from 'meteor/mongo'

export const MovieDB = new Mongo.Collection('movie')
export const MovieWatch = new Mongo.Collection('movie_watch')
export const WatchDb = new Mongo.Collection('watch_later')
