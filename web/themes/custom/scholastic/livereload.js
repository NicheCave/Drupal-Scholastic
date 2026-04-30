const livereload = require('livereload');
const path = require('path');

const server = livereload.createServer({
  port: 35729,
  host: '0.0.0.0',
  exts: ['twig', 'css', 'js', 'theme', 'info.yml'], // Files to watch
  debug: true
});

// Watch your theme directory
server.watch(__dirname);
console.log("LiveReload is watching your theme files...");