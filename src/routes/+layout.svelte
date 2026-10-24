<script>
	import '../app.css';

	/** @type {{children: import('svelte').Snippet}} */
	let { children } = $props();

	// Discord renders this instead of the OG card when a link is pasted. It
	// never runs scripts, so it has to be in the prerendered <head>, and the
	// payload is capped at 3000 bytes.
	// https://docs.discord.com/developers/link-previews/component-embeds
	const discordEmbed = JSON.stringify({
		component: {
			type: 17,
			accent_color: 0xc8acd6,
			components: [
				{
					type: 9,
					components: [
						{ type: 10, content: '## [Tuni · A native terminal workspace for Linux](https://tuni.unisic.app/)' },
						{
							type: 10,
							content:
								"** **\nTerminals, projects, files and Git in one window. Rust and GTK4, with Ghostty's libghostty-vt doing the emulation. Free software, GPLv3."
						}
					],
					accessory: { type: 11, media: { url: 'https://tuni.unisic.app/img/tuni.png' } }
				},
				{ type: 14, divider: true, spacing: 2 },
				{ type: 12, items: [{ media: { url: 'https://tuni.unisic.app/img/og.png' } }] },
				{ type: 14, divider: true, spacing: 1 },
				{
					type: 1,
					components: [
						{ type: 2, style: 5, label: 'Download', url: 'https://github.com/unisic/tuni/releases' },
						{ type: 2, style: 5, label: 'GitHub', url: 'https://github.com/unisic/tuni' },
						{ type: 2, style: 5, label: 'Discord', url: 'https://discord.gg/U2Eyw6xQBz' }
					]
				}
			]
		}
	}).replaceAll('<', '\\u003c');
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
	<meta property="og:image" content="https://tuni.unisic.app/img/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script id="discord:component-embed" type="application/json">${discordEmbed}</script>`}
	<link rel="preload" href="/fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/atkinson-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
