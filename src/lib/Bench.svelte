<script>
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { reveal, reduced } from './motion.js';

	// From the README's table: 200 MiB of mixed output, best of five runs.
	/** @type {[string, string, number][]} */
	const rows = [
		['tuni', 'GTK4 + libghostty-vt', 169.1],
		['kero', 'Go + libghostty-vt', 139.4],
		['foot', 'Wayland, CPU', 133.1],
		['urxvt', 'X11, CPU', 123.6],
		['alacritty', 'GPU, OpenGL', 111.7],
		['kitty', 'GPU, OpenGL', 104.8],
		['st', 'X11, CPU', 90.4],
		['ghostty', 'GTK4 + GPU', 79.2],
		['gnome-terminal', 'VTE 0.84', 66.7],
		['konsole', 'Qt', 40.2]
	];
	const max = 169.1;

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
