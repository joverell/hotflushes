const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = [
  { url: 'https://www.trybooking.com/UserData/Homepage/P/EHI1242094-e7aee291692e4fdf8b857621ea9d09c8.jpeg', dest: 'public/images/home-bg.jpg' },
  { url: 'https://www.thehotflushes.com.au/images/HotFlushes_SentimentalJourney.jpg', dest: 'public/images/albums/sentimental-journey.jpg' },
  { url: 'https://www.thehotflushes.com.au/images/album_writing_5.gif', dest: 'public/images/albums/serendipity.jpg' },
  // Sentimental Journey MP3s
  { url: 'https://www.thehotflushes.com.au/album/Sentimental%20Journey%20-%2001%20-%20Sentimental%20Journey.mp3', dest: 'public/audio/albums/sj-01.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/Sentimental%20Journey%20-%2002%20-%20Boogie%20Woogie%20Bugle%20Boy.mp3', dest: 'public/audio/albums/sj-02.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/Sentimental%20Journey%20-%2003%20-%20Don%27t%20Cry%20Loud.mp3', dest: 'public/audio/albums/sj-03.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/Sentimental%20Journey%20-%2011%20-%20Close%20To%20You.mp3', dest: 'public/audio/albums/sj-11.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/Sentimental%20Journey%20-%2012%20-%20I%20Knew%20Him%20So%20Well.mp3', dest: 'public/audio/albums/sj-12.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/Sentimental%20Journey%20-%2014%20-%20I%20Got%20Rythm.mp3', dest: 'public/audio/albums/sj-14.mp3' },
  // Serendipity MP3s
  { url: 'https://www.thehotflushes.com.au/album/The%20Hot%20Flushes%20-%2001%20-%20%20A%20World%20of%20Our%20Own-sample.mp3', dest: 'public/audio/albums/s-01.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/The%20Hot%20Flushes%20-%2004%20-%20%20I%20Am%20Australian-sample.mp3', dest: 'public/audio/albums/s-04.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/The%20Hot%20Flushes%20-%2006%20-%20%20You%20Make%20Me%20Feel%20So%20Young-sample.mp3', dest: 'public/audio/albums/s-06.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/The%20Hot%20Flushes%20-%2009%20-%20%20Memory-sample.mp3', dest: 'public/audio/albums/s-09.mp3' },
  { url: 'https://www.thehotflushes.com.au/album/The%20Hot%20Flushes%20-%2013%20-%20%20Let%20Me%20Be%20There-sample.mp3', dest: 'public/audio/albums/s-13.mp3' },
];

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${url} -> ${dest}`);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading ${url}: ${err.message}`);
  });
}

// Ensure directories exist
['public/images/albums', 'public/audio/albums'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

downloads.forEach(d => download(d.url, d.dest));
