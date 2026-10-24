<script>
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { reveal, reduced } from './motion.js';

	// From the README's table: 200 MiB of mixed output, best of two runs.
	/** @type {[string, string, number][]} */
	const rows = [
		['urxvt', 'X11, CPU', 126.6],
		['foot', 'Wayland, CPU', 118.3],
		['tuni', 'GTK4 + libghostty-vt', 116.0],
		['alacritty', 'GPU, OpenGL', 112.0],
		['kitty', 'GPU, OpenGL', 110.6],
		['st', 'X11, CPU', 90.2],
		['ghostty', 'GTK4 + GPU', 71.8],
		['gnome-terminal', 'VTE 0.84', 70.1],
		['konsole', 'Qt', 43.1]
	];
	const max = 126.6;

	// Starts full so the prerendered page carries the real numbers; drops to
	// zero on hydration (the table is below the fold) and fills on sight.
	const progress = new Tween(1, { duration: 1400, easing: cubicOut });

	/** @type {import('svelte/attachments').Attachment} */
	function arm() {
		if (!reduced()) progress.set(0, { duration: 0 });
	}
</script>

<div class="bench" {@attach arm} {@attach reveal(0, () => (progress.target = 1))}>
	<table>
		<caption class="sr-only">Throughput in MiB/s, higher is faster</caption>
		<thead>
			<tr>
				<th scope="col">Terminal</th>
				<th scope="col">Engine</th>
				<th scope="col"><span class="sr-only">Bar</span></th>
				<th scope="col" class="num">MiB/s</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as [name, engine, value] (name)}
				<tr class:me={name === 'tuni'}>
					<th scope="row">{name}</th>
					<td>{engine}</td>
					<td class="bar"><span style:width="{(value / max) * progress.current * 100}%"></span></td>
					<td class="num">{(value * progress.current).toFixed(1)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
