import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions[]} */
export default [
	{
		input: 'src/index.ts',
		output: {
			file: 'src/test/js/test.js',
			name: '$styleSheet',
			format: 'iife',
		},
		plugins: [
			del({ targets: 'src/test/js' }),
			resolve({
				preferBuiltins: true,
				rootDir: 'src',
			}),
			typescript(),
			commonjs(),
			esbuild({
				target: 'node14',
			}),
			terser({
				module: false,
				compress: {
					ecma: 2015,
					pure_getters: true,
				},
				safari10: true,
			}),
		],
	},
];
