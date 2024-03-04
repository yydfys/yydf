import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import { createHash } from 'crypto';
const env = process.env.NODE_ENV;

const config = {
    input: ['./src/index.js'],
    output: {
        dir: './dist',
        format: 'cjs',
        entryFileNames: '[name].js',
    },
    plugins: [
        resolve(),
        commonjs(),
        json(),
        babel({
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
        }),
        genMd5(),
    ],
};

function genMd5() {
    return {
        name: 'gen-output-file-md5',
        closeBundle() {
            const md5 = createHash('md5').update(fs.readFileSync('./dist/index.js')).digest('hex');
            fs.writeFileSync('./dist/index.js.md5', md5);
        },
    };
}

if (env === 'production') {
    config.plugins.push(
        terser({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false,
            },
        })
    );
}

export default config;
