import { Mongo } from 'meteor/mongo'

export const CommentDB = new Mongo.Collection('comments');
