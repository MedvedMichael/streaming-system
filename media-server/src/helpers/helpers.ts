const spawn = require('child_process').spawn
import config from '../config/default'
const cmd = config.rtmp_server.fission.ffmpeg;

export const generateStreamThumbnail = (stream_key: string) => {
    const args = [
        '-y',
        '-i', 'http://127.0.0.1:8888/live/'+stream_key+'.flv',
        '-ss', '00:00:01',
        '-vframes', '1',
        '-vf', 'scale=-2:300',
        'server/thumbnails/'+stream_key+'.png',
    ];

    spawn(cmd, args, {
        detached: true,
        stdio: 'ignore'
    }).unref();
};



