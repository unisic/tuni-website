<script>
	import { reduced } from './motion.js';

	const themes = [
		{ name: 'Catppuccin Mocha', src: '/img/hero.webp' },
		{ name: 'GitHub Light Default', src: '/img/theme-github-light-default.webp' },
		{ name: 'Rose Pine', src: '/img/theme-rose-pine.webp' },
		{ name: 'TokyoNight Storm', src: '/img/theme-tokyonight-storm.webp' },
		{ name: 'Kanagawa Wave', src: '/img/theme-kanagawa-wave.webp' },
		{ name: 'Gruvbox Dark', src: '/img/theme-gruvbox-dark.webp' }
	];

	let active = $state(0);
	// Cycles by itself until someone picks one; the next step is the active
	// chip's progress bar finishing, so there is no timer to keep in sync.
	let auto = $state(false);
	let visible = $state(false);

	/** @type {import('svelte/attachments').Attachment} */
	function watch(node) {
		if (reduced()) return;
		auto = true;
		const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			threshold: 0.35
		});
		io.observe(node);
		return () => io.disconnect();
	}

	/** @param {number} i */
	function pick(i) {
		active = i;
		auto = false;
	}
</script>

<div class="themes" {@attach watch}>
	<div class="theme-stage">
		{#each themes as theme, i (theme.name)}
			<img
				src={theme.src}
				width="1200"
				height="747"
				loading="lazy"
				decoding="async"
				class:on={i === active}
				alt={i === active ? `The workspace in ${theme.name}.` : ''}
				aria-hidden={i !== active}
			/>
		{/each}
	</div>
	<div class="theme-chips" role="group" aria-label="Theme">
		{#each themes as theme, i (theme.name)}
			<button type="button" class="chip" aria-pressed={i === active} onclick={() => pick(i)}>
				{theme.name}
				{#if auto && i === active}
					<span
						class="chip-timer"
						class:paused={!visible}
						onanimationend={() => (active = (active + 1) % themes.length)}
					></span>
				{/if}
			</button>
		{/each}
	</div>
</div>
