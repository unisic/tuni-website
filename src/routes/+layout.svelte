<script>
	import '../app.css';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<svelte:head>
	<!-- sizes keeps browsers that read SVG on the SVG; the .ico is for those that ask /favicon.ico directly. -->
	<link rel="icon" href="/favicon.ico" sizes="32x32" />
	<link rel="icon" href="/img/tuni.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="preload" href="/fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/atkinson-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
