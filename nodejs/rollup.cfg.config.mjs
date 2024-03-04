import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import { createHash } from 'crypto';

const config = {
    input: ['./src/index.config.js'],
    output: {
        dir: './dist',
        format: 'cjs',
        entryFileNames: '[name].js',
        strict: false,
    },
    plugins: [commonjs(), json(), genMd5()],
};

function genMd5() {
    return {
        name: 'gen-output-file-md5',
        closeBundle() {
            const md5 = createHash('md5').update(fs.readFileSync('./dist/index.config.js')).digest('hex');
            fs.writeFileSync('./dist/index.config.js.md5', md5);
        },
    };
}

export default config;
