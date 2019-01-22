'use strict';

const mime = require('mime-types')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const pump = require('pump')
const fs = require('fs')
let MainPath = Npm.require('path')
let path = MainPath.resolve('.').split('.meteor')[0]
let Transcoder = require('./module/transcoder')
let torrentStream = require('torrent-stream')
let moment = require('moment')
let currentStream = null
import {
	MovieDB
} from '/common/Collections/Movie.jsx'

export default function CreateTorrent(hash, res, req) {
	let pathDb = null
	let mimeType = null
	let magnetLink = 'magnet:?xt=urn:btih:' + hash
	let tvShow = false
	if (hash.split(':')[0] === 'magnet') {
		magnetLink = hash.split('&')[0]
		tvShow = true
	}
	let result = MovieDB.findOne({
		magnet: magnetLink
	})
	if (!result || !result.finished) {
		let engine = torrentStream(magnetLink, {
			tmp: '/sgoinfre/goinfre/Perso/llonger/hypertube/videos/Torrents/downloading',
			// path: path + 'Torrents/downloading',
			path: '/sgoinfre/goinfre/Perso/llonger/hypertube/videos',
			verify: true,
			trackers: [
				'udp://tracker.leechers-paradise.org:6969/announce',
				'udp://tracker.pirateparty.gr:6969/announce',
				'udp://tracker.coppersurfer.tk:6969/announce',
				'http://asnet.pw:2710/announce',
				'http://tracker.opentrackr.org:1337/announce',
				'udp://tracker.opentrackr.org:1337/announce',
				'udp://tracker1.xku.tv:6969/announce',
				'udp://tracker1.wasabii.com.tw:6969/announce',
				'udp://tracker.zer0day.to:1337/announce',
				'udp://p4p.arenabg.com:1337/announce',
				'http://tracker.internetwarriors.net:1337/announce',
				'udp://tracker.internetwarriors.net:1337/announce',
				'udp://allesanddro.de:1337/announce',
				'udp://9.rarbg.com:2710/announce',
				'udp://tracker.dler.org:6969/announce',
				'http://mgtracker.org:6969/announce',
				'http://tracker.mg64.net:6881/announce',
				'http://tracker.devil-torrents.pl:80/announce',
				'http://ipv4.tracker.harry.lu:80/announce',
				'http://tracker.electro-torrent.pl:80/announce',
				'udp://tracker.openbittorrent.com:80',
				'udp://open.demonii.com:80',
				'udp://tracker.coppersurfer.tk:80',
				'udp://tracker.leechers-paradise.org:6969',
				'udp://exodus.desync.com:6969'
			]
		})
		let SaveToDb = Meteor.bindEnvironment(() => {
			if (magnetLink && pathDb && mimeType) {
				let newMovie = {
					magnet: magnetLink,
					path: pathDb,
					last_watch: moment().format('x'),
					mimeType,
					finished: false
				}
				MovieDB.upsert({
					magnet: magnetLink
				}, newMovie)
			}
		})
		engine.on('idle', Meteor.bindEnvironment((torrent) => {
			let newMovie = {
				magnet: magnetLink,
				path: pathDb,
				last_watch: moment().format('x'),
				mimeType,
				finished: true
			}
			MovieDB.upsert({
				magnet: magnetLink
			}, newMovie)
		}))
		/* engine.on('error', (err) => {
			console.log('err downloading torrent', err)
		}) */
		engine.on('ready', function () {
			engine.files.forEach(function (file) {
				if (
					MainPath.extname(file.name) !== '.mp4' &&
					MainPath.extname(file.name) !== '.avi' &&
					MainPath.extname(file.name) !== '.mkv' &&
					MainPath.extname(file.name) !== '.ogg'
				) {
					file.deselect();
					return;
				}
				let mimetype = mime.lookup(file.name)
				let isVideo = mimetype.split('/')[0];
				if (isVideo === 'video') {
					file.select()
					pathDb = file.path
					mimeType = mimetype
					SaveToDb()
					let fileName = file.path.replace(MainPath.extname(file.name), '');
					let fileExt = MainPath.extname(file.name)
					let total = file.length;
					if (hash.split(':')[0] === 'magnet') {
						let start = 0
						let end = total - 1
						if (req.headers.range) {
							let range = req.headers.range
							let parts = range.replace(/bytes=/, '').split('-')
							let newStart = parts[0]
							let newEnd = parts[1]

							start = parseInt(newStart, 10)
							end = newEnd ? parseInt(newEnd, 10) : total - 1
							let chunksize = end - start + 1
							res.writeHead(206, {
								'Content-Range': 'bytes ' + start + '-' + end + '/*',
								// 'Accept-Ranges': 'bytes',
								// 'Content-Length': total,
								'Content-Type': 'video/mp4',
								Connection: 'keep-alive'
							})
							streamFile(res, file, start, end, mimetype, fileName)
						} else {
							res.writeHead(200, {
								// 'Content-Length': total,
								'Content-Type': 'video/mp4',
								// Connection: 'keep-alive'
							})
							// mimeType = mimetype
							streamFile(res, file, start, end, mimetype, fileName)
						}
					} else {
						if (mimetype !== 'video/ogg' && mimetype !== 'video/mp4') {
							mimetype = 'video/mp4'
						}
						let start = 0
						let end = total - 1
						if (req.headers.range) {
							let range = req.headers.range
							let parts = range.replace(/bytes=/, '').split('-')
							let newStart = parts[0]
							let newEnd = parts[1]

							start = parseInt(newStart, 10)
							end = newEnd ? parseInt(newEnd, 10) : total - 1
							let chunksize = end - start + 1
							res.writeHead(206, {
								'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
								'Accept-Ranges': 'bytes',
								'Content-Length': chunksize,
								'Content-Type': mimetype,
								Connection: 'keep-alive'
							})
							mimeType = mimetype
							streamFile(res, file, start, end, mimetype, fileName)
						} else {
							res.writeHead(200, {
								'Content-Length': total,
								'Content-Type': mimetype,
							})
							mimeType = mimetype
							streamFile(res, file, start, end, mimetype, fileName)
						}
					}
				}
			})
		})
	} else {
		let now = moment().format('x')
		MovieDB.update({
			_id: result._id
		}, {$set:{'last_watch': now}})
		let file = result.path
		let stat = fs.statSync('/sgoinfre/goinfre/Perso/llonger/hypertube/videos/' + file)
		let total = stat.size
		let start = 0
		let end = total - 1
		let mimetype = result.mimeType
		if (req.headers.range) {
			let range = req.headers.range
			let parts = range.replace(/bytes=/, '').split('-')
			let newStart = parts[0]
			let newEnd = parts[1]

			start = parseInt(newStart, 10)
			end = newEnd ? parseInt(newEnd, 10) : total - 1
			let chunksize = end - start + 1
			if (mimetype === 'video/mp4') {
				res.writeHead(206, {
					'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
					'Accept-Ranges': 'bytes',
					'Content-Length': chunksize,
					'Content-Type': mimetype,
					Connection: 'keep-alive'
				})
			} else {
				res.writeHead(206, {
					'Content-Range': 'bytes ' + start + '-' + end + '/*',
					// 'Accept-Ranges': 'bytes',
					// 'Content-Length': total,
					'Content-Type': 'video/mp4',
					Connection: 'keep-alive'
				})
			}
			streamFile2(res, file, start, end, mimetype)
		} else {
			res.writeHead(200, {
				'Content-Length': total,
				'Content-Type': mimetype,
			})

			streamFile2(res, file, start, end, mimetype)
		}
	}
}

function streamFile2(res, file, start, end, mimetype, fileName) {
	if (currentStream) {
		currentStream.destroy((err) => {})
	}
	currentStream = res
	if (mimetype === 'video/ogg' || mimetype === 'video/mp4') {
		// let stream = fs.createReadStream(path + '/Torrents/downloading/' + file, {
		let stream = fs.createReadStream('/sgoinfre/goinfre/Perso/llonger/hypertube/videos/' + file, {
			start,
			end
		})
		stream.pipe(res)
	}
	else {
		// let stream = fs.createReadStream(path + '/Torrents/downloading/' + file, {
		let torrent = fs.createReadStream('/sgoinfre/goinfre/Perso/llonger/hypertube/videos/' + file, {
			start,
			end
		})
		new Transcoder(torrent)
			// .maxSize(320, 240)
			.videoCodec('h264')
			.videoBitrate(800 * 1000)
			.fps(25)
			.audioCodec('libvorbis')
			.sampleRate(44100)
			.channels(2)
			.audioBitrate(128 * 1000)
			.format('mp4')
			// .custom('ss', '00:18:00')
			.on('finish', function () {
				// console.log('Transcode finished')
			})
			.on('error', error => {
				// console.log('error transcoding file: ', error)
			})
			.stream().pipe(res)
	}
}

function streamFile(res, file, start, end, mimetype, fileName) {
	if (currentStream) {
		currentStream.destroy((err) => {})
	}
	currentStream = res
	if (mimetype === 'video/ogg' || mimetype === 'video/mp4') {
		let stream = file.createReadStream({
			start: start,
			end: end
		})
		stream.pipe(res)
		// pump(stream, res);
	} else {
		let torrent = file.createReadStream({
			start: start,
			end: end
		});
		new Transcoder(torrent)
			// .maxSize(320, 240)
			.videoCodec('h264')
			.videoBitrate(800 * 1000)
			.fps(25)
			.audioCodec('libvorbis')
			.sampleRate(44100)
			.channels(2)
			.audioBitrate(128 * 1000)
			.format('mp4')
			.on('finish', function () {
			})
			.on('error', error => {
				// console.log('error transcoding file: ', error)
			})
			.stream().pipe(res)
	}
}

function sendError(err, res) {
	res.status(204);
	res.send(err);
}
