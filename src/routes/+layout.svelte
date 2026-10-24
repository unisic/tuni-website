<script>
	import '../app.css';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<svelte:head>
	<title>Tuni · A native terminal workspace for Linux</title>
	<meta
		name="description"
		content="Terminals, projects, files and Git in one window. Rust and GTK4, with Ghostty's libghostty-vt doing the emulation. Free software, GPLv3."
	/>
	<link rel="icon" href="/img/tuni.svg" type="image/svg+xml" />
	<link rel="canonical" href="https://tuni.unisic.app/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Tuni · A native terminal workspace for Linux" />
	<meta property="og:description" content="Terminals, projects, files and Git in one window." />
	<meta property="og:url" content="https://tuni.unisic.app/" />
	<meta property="og:image" content="https://tuni.unisic.app/img/og.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="preload" href="/fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/atkinson-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
