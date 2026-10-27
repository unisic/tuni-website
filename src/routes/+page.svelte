<script>
	import { clip, reveal, scrollProgress } from '#lib/motion.js';
	import CmdCopy from '#lib/CmdCopy.svelte';
	import Bench from '#lib/Bench.svelte';
	import Themes from '#lib/Themes.svelte';

	const install = 'curl -fsSL https://tuni.unisic.app/install.sh | bash';

	const site = 'https://tuni.unisic.app/';
	const title = 'Tuni · A native terminal workspace for Linux';
	const description =
		"Terminals, projects, files and Git in one window. Rust and GTK4, with Ghostty's libghostty-vt doing the emulation. Free software, GPLv3.";

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
						{ type: 10, content: `## [${title}](${site})` },
						{ type: 10, content: `** **\n${description}` }
					],
					accessory: { type: 11, media: { url: `${site}img/tuni.png` } }
				},
				{ type: 14, divider: true, spacing: 2 },
				{ type: 12, items: [{ media: { url: `${site}img/og.png` } }] },
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

	// What search engines show as the site name, and what they know of the app.
	// https://developers.google.com/search/docs/appearance/site-names
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{ '@type': 'WebSite', name: 'Tuni', url: site },
			{
				'@type': 'SoftwareApplication',
				name: 'Tuni',
				description,
				url: site,
				image: `${site}img/og.png`,
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Linux',
				license: 'https://www.gnu.org/licenses/gpl-3.0.html',
				downloadUrl: 'https://github.com/unisic/tuni/releases',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
				publisher: { '@type': 'Organization', name: 'Unisic', url: 'https://unisic.app' },
				sameAs: ['https://github.com/unisic/tuni']
			}
		]
	}).replaceAll('<', '\\u003c');

	// Empty spots in the hero screenshot, in percent of the image, so a label
	// covers nothing it names. `area` is the part it names: left, top, width, height.
	const callouts = [
		{ label: 'Projects', x: 6, y: 35, area: [0.4, 0.5, 10.7, 99] },
		{ label: 'Split panes', x: 28, y: 54, area: [11.5, 8.6, 33.4, 90.5] },
		{ label: 'Source editor', x: 62, y: 11, area: [45.2, 8.6, 33.4, 90.5] },
		{ label: 'Git, a hunk at a time', x: 88, y: 15, area: [79, 4, 20.7, 95.6] }
	];
	/** @param {number[]} a */
	const box = ([l, t, w, h]) => `left:${l}%;top:${t}%;width:${w}%;height:${h}%`;

	// The area the pointer is over, or -1; `held` keeps the last one so the
	// frame fades out where it was instead of jumping first.
	let lit = $state(-1);
	let held = $state(0);

	/** @type {import('svelte/attachments').Attachment<HTMLElement>} */
	function light(node) {
		const over = (/** @type {PointerEvent} */ e) => {
			if (e.pointerType === 'touch') return;
			const el = /** @type {Element} */ (e.target).closest('[data-area]');
			if (!(el instanceof HTMLElement)) return;
			lit = held = Number(el.dataset.area);
		};
		const leave = () => (lit = -1);
		node.addEventListener('pointerover', over);
		node.addEventListener('pointerleave', leave);
		return () => {
			node.removeEventListener('pointerover', over);
			node.removeEventListener('pointerleave', leave);
		};
	}

	const cells = [
		['Kitty graphics and links', 'Images in the terminal, OSC 8 hyperlinks, desktop notifications and progress bars.'],
		['Long commands report back', 'A command that ends in a background tab says what it was and how long it took.'],
		['Coding agents', 'A working agent spins on its tab and leaves a mark when it finishes out of sight. Ctrl+Shift+J goes to the next tab that needs you, and a worktree tab gives each agent its own branch.'],
		['Tear it out', 'Drag a tab or a project into its own window. The shells keep running.'],
		['Every pane at once', 'Type into every pane of a tab at once. Ctrl+Shift+Backspace clears the line in any shell.'],
		['Back as you left it', 'Restore the Last Session brings back projects, tabs, splits and open files. Off by default.']
	];

	// The feature clips, recorded from Tuni itself; each one ends where it starts.
	const clips = {
		diff: {
			width: 1430,
			height: 600,
			label: 'A diff of window.rs in a pane, two hunks with the changed words highlighted. The pointer stages the first hunk with its plus button, the Git panel lists window.rs as both staged and changed, and unstaging it brings the hunk back.'
		},
		info: {
			width: 1430,
			height: 520,
			label: 'python3 -m http.server 4173 is typed into a pane and run. The Info panel then lists the python3.14 process with its CPU and memory and port 4173 under Ports, and both lists empty again after Ctrl+C.'
		},
		hosts: {
			width: 1430,
			height: 540,
			label: 'The Connect page: a search field, Local shell, and four hosts with Debian, Linux, Fedora and Arch logos, their user and address, and tags. Typing fra narrows it to VPS Frankfurt, and pi to Raspberry Pi.'
		},
		palette: {
			width: 1300,
			height: 620,
			label: 'The command palette opened over two terminals and an editor. Searching for tab lists New Tab, Reopen Closed Tab, Previous Tab, Rename Tab, Close Tab and Next Tab, each with its shortcut.'
		}
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={site} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Tuni" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content="Terminals, projects, files and Git in one window." />
	<meta property="og:url" content={site} />
	<meta property="og:image" content="{site}img/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Tuni: a native terminal workspace for Linux. Terminals, projects, files and Git in one window. Rust and GTK4, GPLv3."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script id="discord:component-embed" type="application/json">${discordEmbed}</script>`}
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

{#snippet feature(/** @type {keyof typeof clips} */ name)}
	<figure class="shot shot-wipe" {@attach reveal(120)} {@attach clip}>
		<video
			poster="/img/{name}.webp"
			width={clips[name].width}
			height={clips[name].height}
			muted
			loop
			playsinline
			preload="none"
			aria-label={clips[name].label}
		>
			<source src="/video/{name}.av1.mp4" type="video/mp4; codecs=av01.0.05M.08" />
			<source src="/video/{name}.mp4" type="video/mp4" />
		</video>
		<button class="shot-play" type="button" aria-label="Pause" aria-pressed="false" hidden>
			<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
				<path class="i-pause" d="M4 3h3v10H4zm5 0h3v10H9z" />
				<path class="i-play" d="M5 2.5v11l8.5-5.5z" />
			</svg>
		</button>
	</figure>
{/snippet}

<div class="page" {@attach scrollProgress(560)}>
	<a class="skip" href="#main">Skip to content</a>

	<header class="nav">
		<div class="wrap nav-inner">
			<a class="brand" href="#top" aria-label="Tuni, back to top">
				<img src="/img/tuni.svg" width="28" height="28" alt="" />
				<span>Tuni</span>
			</a>
			<nav class="nav-links" aria-label="Sections">
				<a href="#features">Features</a>
				<a href="#performance">Performance</a>
				<a href="#themes">Themes</a>
				<a href="#install">Install</a>
			</nav>
			<a class="pill pill-ghost nav-cta" href="https://github.com/unisic/tuni">GitHub</a>
		</div>
	</header>

	<main id="main">
		<section class="hero" id="top">
			<div class="hero-glow" aria-hidden="true"></div>
			<div class="wrap hero-copy">
				<p class="eyebrow load" style:--i="0">
					<span class="prompt" aria-hidden="true">❯</span> v1.7.1 · GPLv3 · Linux
				</p>
				<h1 class="load" style:--i="1">
					A native terminal workspace for Linux.
				</h1>
				<p class="lede load" style:--i="2">
					Terminals, projects, files and Git in one window. Rust and GTK4, with Ghostty's
					<code>libghostty-vt</code> doing the emulation.
				</p>
				<div class="load" style:--i="3">
					<CmdCopy command={install} />
				</div>
				<p class="hero-links load" style:--i="4">
					<a href="https://github.com/unisic/tuni/releases">rpm, deb and Arch packages</a>
					<span aria-hidden="true">·</span>
					<a href="#install">Other ways to install</a>
				</p>
			</div>

			<div class="wrap wrap-wide hero-stage">
				<figure class="shot shot-hero" class:lit={lit >= 0} {@attach light}>
					<img
						src="/img/hero.webp"
						width="1910"
						height="1190"
						fetchpriority="high"
						alt="Tuni with four projects in the sidebar. The tuni project has three tabs; the open one is split into a git log, a cargo test run and session.rs in the editor, with the Git panel on the right listing staged and changed files."
					/>
					<div class="areas" aria-hidden="true">
						{#each callouts as c, i (c.label)}
							<div data-area={i} style={box(c.area)}></div>
						{/each}
						<div class="frame" style={box(callouts[held].area)}></div>
					</div>
					{#each callouts as c, i (c.label)}
						<span
							class="callout"
							class:on={lit === i}
							data-area={i}
							style:left="{c.x}%"
							style:top="{c.y}%"
							style:--i={i}
							aria-hidden="true"
						>
							{c.label}
						</span>
					{/each}
				</figure>
			</div>
		</section>

		<section class="section" id="features">
			<div class="wrap">
				<div {@attach reveal()}>
					<h2>Shells, and everything you open beside them.</h2>
					<p class="section-lede">
						Panes in a niri-style layout, inside tabs, inside projects. The file tree, Git and an editor share the
						window with them.
					</p>
				</div>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>Stage a hunk, not a file.</h3>
						<p>
							A changed file opens as a diff in a pane, word changes marked, with a stage button on every hunk.
						</p>
						<p class="muted">Branch, commit, amend and history are in the same panel.</p>
					</div>
					{@render feature('diff')}
				</article>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>What is running, and what is listening.</h3>
						<p>
							The Info page follows the focused pane: shell, directory, every process with CPU and memory, and the
							TCP ports they listen on, one click from the browser.
						</p>
						<p class="muted">A remote pane also shows whether the connection is up and which ports it carries.</p>
					</div>
					{@render feature('info')}
				</article>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>The hosts you already have.</h3>
						<p>
							Every host in <code>~/.ssh/config</code> opens in a pane, with one shared connection per machine and
							an SFTP page. A host takes a label, tags and one of 42 system logos.
						</p>
						<p class="muted">
							OpenSSH does the connecting, so passwords, passphrases and 2FA work as always. A saved password goes
							into the desktop keyring, and Tuni never reads it back.
						</p>
					</div>
					{@render feature('hosts')}
				</article>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>Every action, by name.</h3>
						<p>
							The command palette finds any action and shows its shortcut. Also a tab switcher, and find in the
							focused pane.
						</p>
						<p class="muted">
							It also runs the project's <code>package.json</code> scripts and <code>justfile</code> or <code>Makefile</code>
							tasks. Every shortcut can be rebound in Settings.
						</p>
					</div>
					{@render feature('palette')}
				</article>

				<ul class="cells" role="list">
					{#each cells as [title, text], i (title)}
						<li class="cell" {@attach reveal(i * 70)}>
							<h3>{title}</h3>
							<p>{text}</p>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="section section-alt" id="performance">
			<div class="wrap">
				<div {@attach reveal()}>
					<h2>151 MiB/s, first of nineteen.</h2>
					<p class="section-lede">
						200 MiB of plain and colored output, best of five runs, nineteen terminals on one machine. Ahead of
						foot and every GPU terminal, and the first to a shell: 5 ms after launch.
					</p>
				</div>
				<Bench />
				<p class="muted small">
					Ten of nineteen shown, one run on 2026-10-25 in a headless compositor. kero is left out: headless it
					drops to 42 MiB/s from 139 on the desktop, where tuni led it by a fifth. All nineteen, the method and
					the caveats are in
					<a href="https://github.com/unisic/tuni/blob/main/docs/BENCHMARK.md">docs/BENCHMARK.md</a>.
				</p>
				<div class="bench compare" {@attach reveal()}>
					<table>
						<caption class="sr-only">Tuni 1.7.1 against 1.7.0, measured in the same session</caption>
						<thead>
							<tr>
								<th scope="col">Against 1.7.0</th>
								<th scope="col" class="num">1.7.0</th>
								<th scope="col" class="num">1.7.1</th>
							</tr>
						</thead>
						<tbody>
							<tr><th scope="row">30 Hz spinner, CPU ms per 10 s</th><td class="num">452.6</td><td class="num">193.6</td></tr>
							<tr><th scope="row">Search 50,000 lines, ms</th><td class="num">44.6</td><td class="num">25.4</td></tr>
							<tr><th scope="row">Session save, ms per pane</th><td class="num">70.1</td><td class="num">28.1</td></tr>
							<tr><th scope="row">Throughput, MiB/s</th><td class="num">153.9</td><td class="num">154.8</td></tr>
							<tr><th scope="row">Memory, PSS MiB</th><td class="num">48.9</td><td class="num">49.2</td></tr>
						</tbody>
					</table>
				</div>
				<p class="muted small">
					Both versions interleaved in one session, medians. Search and save are timed outside the app, over a full
					scrollback. A pane costs about 0.4 MiB, closing it frees every thread and descriptor, and scrollback is
					capped: 400 MiB of output leaves no more behind than 200.
				</p>
			</div>
		</section>

		<section class="section" id="themes">
			<div class="wrap">
				<div {@attach reveal()}>
					<h2>574 themes, chrome included.</h2>
					<p class="section-lede">
						Ghostty's whole collection. A theme paints the sidebar, tabs and panels too, not only the terminal.
						Light and dark mode can each have their own.
					</p>
				</div>
				<Themes />
			</div>
		</section>

		<section class="section section-alt" id="install">
			<div class="wrap">
				<div {@attach reveal()}>
					<h2>One line, then it updates itself.</h2>
					<p class="section-lede">
						The installer installs, updates, goes back to an older release or removes Tuni. Tuni checks for a new
						release once per run and offers an Update button.
					</p>
				</div>

				<CmdCopy command={install} large />

				<div class="install-grid">
					<div class="install-card install-card-wide" {@attach reveal()}>
						<h3>From a package manager</h3>
						<p>On Fedora, COPR updates it with the rest of the system.</p>
						<pre><code
								><span class="c"># Fedora, from COPR</span>
sudo dnf copr enable debondor/Tuni &amp;&amp; sudo dnf install tuni</code
							></pre>
					</div>
					<div class="install-card" {@attach reveal(90)}>
						<h3>By hand</h3>
						<p>Every <a href="https://github.com/unisic/tuni/releases">release</a> carries the same three packages.</p>
						<pre><code
								><span class="c"># Fedora 44+</span>
sudo dnf install ./tuni-*.rpm
<span class="c"># Ubuntu 26.04+</span>
sudo apt install ./tuni_*_amd64.deb
<span class="c"># Arch</span>
sudo pacman -U ./tuni-*-x86_64.pkg.tar.zst</code
							></pre>
					</div>
					<div class="install-card" {@attach reveal(180)}>
						<h3>From source</h3>
						<p>
							Needs Rust, GTK4, libadwaita, GtkSourceView and SQLite headers, and Zig 0.17.0, which
							<code>make zig</code> fetches. Details in <a href="https://github.com/unisic/tuni#building">Building</a>.
						</p>
						<pre><code>git clone https://github.com/unisic/tuni
cd tuni
sudo make install PREFIX=/usr</code></pre>
					</div>
				</div>
			</div>
		</section>
	</main>

	<footer class="footer">
		<div class="wrap footer-inner">
			<figure class="uni" {@attach reveal()}>
				<img
					src="/img/uni.webp"
					width="640"
					height="512"
					loading="lazy"
					decoding="async"
					alt="Uni, the Unisic mascot: a cat-eared girl in a purple hoodie, sitting on top of a window."
				/>
				<figcaption>Uni approves this shell.</figcaption>
			</figure>
			<div class="footer-text">
				<p class="footer-brand">
					<img src="/img/tuni.svg" width="24" height="24" alt="" />
					<span>Tuni, part of <a href="https://unisic.app">Unisic</a></span>
				</p>
				<p class="muted">
					Built by <a href="https://github.com/DeBondor">@DeBondor</a> and
					<a href="https://github.com/D3anDark">@D3anDark</a>. Behavior after
					<a href="https://github.com/egoist/kero">kero</a>; terminal emulation by
					<a href="https://ghostty.org/">Ghostty</a>'s <code>libghostty-vt</code>. Free software under the GPLv3.
				</p>
				<ul class="footer-links" role="list">
					<li><a href="https://github.com/unisic/tuni">GitHub</a></li>
					<li><a href="https://github.com/unisic/tuni/releases">Releases</a></li>
					<li><a href="https://github.com/unisic/tuni/blob/main/docs/DESIGN.md">Documentation</a></li>
					<li><a href="https://discord.gg/U2Eyw6xQBz">Discord</a></li>
				</ul>
			</div>
		</div>
	</footer>
</div>
