<script>
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { reveal, reduced } from './motion.js';

	// From the table in docs/BENCHMARK.md: 200 MiB of mixed output, best of five runs, all
	// nineteen in one headless run on 2026-10-25. kero is left out because
	// headless it reaches a third of its desktop number; the note under the
	// table says so and gives the desktop head-to-head instead.
	/** @type {[string, string, number][]} */
	const rows = [
		['tuni', 'GTK4 + libghostty-vt', 151.4],
		['foot', 'Wayland, CPU', 132.2],
		['alacritty', 'GPU, OpenGL', 118.0],
		['kitty', 'GPU, OpenGL', 116.8],
		['urxvt', 'X11, CPU', 106.7],
		['st', 'X11, CPU', 82.0],
		['gnome-terminal', 'VTE 0.84', 65.3],
		['ghostty', 'GTK4 + GPU', 56.7],
		['konsole', 'Qt', 42.5],
		['wezterm', 'GPU, wgpu', 25.5]
	];
	const max = 151.4;

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
				<th scope="col" class="engine">Engine</th>
				<th scope="col"><span class="sr-only">Bar</span></th>
				<th scope="col" class="num">MiB/s</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as [name, engine, value] (name)}
				<tr class:me={name === 'tuni'}>
					<th scope="row">{name}</th>
					<td class="engine">{engine}</td>
					<td class="bar"><span style:width="{(value / max) * progress.current * 100}%"></span></td>
					<td class="num">{(value * progress.current).toFixed(1)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
