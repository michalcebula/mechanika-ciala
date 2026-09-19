import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';
const require = createRequire(import.meta.url);
const cli = join(dirname(require.resolve('sanity/package.json')), 'bin/sanity');
const child = spawn(process.execPath, [cli, 'deploy'], {stdio:['ignore','pipe','pipe'], env:process.env});
let confirmed = false;
let tail = '';
for (const [stream, output] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
  stream.on('data', chunk => {
    output.write(chunk);
    tail = (tail + chunk.toString()).slice(-16000);
    if (tail.includes('Success! Studio deployed to')) confirmed = true;
  });
}
child.on('error', error => {console.error(error.message); process.exitCode = 1;});
child.on('close', code => {
  if (code !== 0 || !confirmed) {
    console.error('Studio deployment was not confirmed. Check the Sanity error above; a zero CLI exit code alone does not indicate deployment.');
    process.exitCode = code || 1;
  }
});
