export const eventConfig = {
 target: '2026-11-21T00:00:00+05:00',
 mapsUrl: 'https://maps.google.com/maps?q=41.431816,69.351008&ll=41.431816,69.351008&z=16',
 localAudio: '/media/happy-birthday.mp3',
 backgroundVideo: null, // Licensed seamless MP4 URL; otherwise the 3D scene is used.
};
export function countdown(target, now = Date.now()) {
 const seconds = Math.max(0, Math.ceil((new Date(target).getTime()-now)/1000));
 return {ended:seconds===0, values:[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60]};
}
