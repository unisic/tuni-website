<script>
	import { reveal, scrollProgress, spotlight } from '#lib/motion.js';
	import CmdCopy from '#lib/CmdCopy.svelte';
	import Bench from '#lib/Bench.svelte';
	import Themes from '#lib/Themes.svelte';

	const install = 'curl -fsSL https://tuni.unisic.app/install.sh | bash';
	const headline = ['A', 'native', 'terminal', 'workspace', 'for', 'Linux.'];

	// Empty spots in the hero screenshot, in percent of the image, so a label
	// covers nothing it names.
	const callouts = [
		{ label: 'Projects', x: 6, y: 35 },
		{ label: 'Split panes', x: 28, y: 54 },
		{ label: 'Source editor', x: 62, y: 11 },
		{ label: 'Git, a hunk at a time', x: 88, y: 15 }
	];

	const cells = [
		['Kitty graphics and links', 'Images in the terminal, OSC 8 hyperlinks, desktop notifications and progress bars.'],
		['Long commands report back', 'A command finishing in a tab you are not watching says so, with what it was and how long it took.'],
		['Coding agents', 'An agent thinking in a pane spins on its tab and its project, and leaves an exclamation there when it finishes in a tab you are not watching.'],
		['Tear it out', 'Drag a tab or a whole project into a window of its own without restarting the shells in it.'],
		['Every pane at once', 'Type one command into every pane of a tab at once, and wipe the line being typed with Ctrl+Shift+Backspace, whatever the shell.'],
		['Back as you left it', 'With Restore the Last Session on, projects, tabs, splits and open files come back. A fresh shell is the default.']
	];
</script>

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
					<span class="prompt" aria-hidden="true">❯</span> v1.6.0 · GPLv3 · Linux
				</p>
				<h1 aria-label={headline.join(' ')}>
					{#each headline as word, i (i)}
						<span class="word" style:--i={i + 1} aria-hidden="true">{word}</span>{' '}
					{/each}<span class="caret" aria-hidden="true"></span>
				</h1>
				<p class="lede load" style:--i="7">
					Terminals, projects, files and Git in one window. Rust and GTK4, with Ghostty's
					<code>libghostty-vt</code> doing the emulation.
				</p>
				<div class="load" style:--i="8">
					<CmdCopy command={install} />
				</div>
				<p class="hero-links load" style:--i="9">
					<a href="https://github.com/unisic/tuni/releases">rpm, deb and Arch packages</a>
					<span aria-hidden="true">·</span>
					<a href="#install">Other ways to install</a>
				</p>
			</div>

			<div class="wrap wrap-wide hero-stage">
				<figure class="shot shot-hero">
					<img
						src="/img/hero.webp"
						width="1910"
						height="1190"
						fetchpriority="high"
						alt="Tuni with four projects in the sidebar. The tuni project has three tabs; the open one is split into a git log, a cargo test run and session.rs in the editor, with the Git panel on the right listing staged and changed files."
					/>
					{#each callouts as c, i (c.label)}
						<span class="callout" style:left="{c.x}%" style:top="{c.y}%" style:--i={i} aria-hidden="true">
							{c.label}
						</span>
					{/each}
				</figure>
			</div>
		</section>

		<section class="section" id="features">
			<div class="wrap">
				<div {@attach reveal()}>
					<p class="eyebrow"><span class="prompt" aria-hidden="true">❯</span> Workspace</p>
					<h2>Shells, and everything you open beside them.</h2>
					<p class="section-lede">
						Panes split in a niri-style layout, grouped into tabs, grouped into projects. The file tree, the Git
						panel and a source editor sit in the same window as the terminals they are about.
					</p>
				</div>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>Stage a hunk, not a file.</h3>
						<p>
							The Git panel shows the branch, what is staged and what changed. A changed file opens as a diff in a
							pane, word changes marked, with a button on each hunk to stage it on its own.
						</p>
						<p class="muted">Commit, amend and the history are in the same panel.</p>
					</div>
					<figure class="shot shot-wipe" {@attach reveal(120)}>
						<img
							src="/img/diff.webp"
							width="1430"
							height="540"
							loading="lazy"
							decoding="async"
							alt="A diff of window.rs in a pane: one hunk, with the removed and added lines and the changed words highlighted. The Git panel beside it lists README.md as staged and two files as changed."
						/>
					</figure>
				</article>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>What is running, and what is listening.</h3>
						<p>
							The Info page follows the pane with the keyboard: its shell, its directory, every process under it
							with CPU and memory, and the TCP ports they listen on, one click from the browser.
						</p>
						<p class="muted">
							A pane on another machine also says whether the connection is still there and which ports it carries.
						</p>
					</div>
					<figure class="shot shot-wipe" {@attach reveal(120)}>
						<img
							src="/img/info.webp"
							width="1430"
							height="520"
							loading="lazy"
							decoding="async"
							alt="A pane running python3 -m http.server on port 4173. The Info panel lists the python3.14 process with its CPU and memory, and port 4173 under Ports."
						/>
					</figure>
				</article>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>The hosts you already have.</h3>
						<p>
							Every host <code>~/.ssh/config</code> declares, ready to open in a pane, one shared connection per
							machine, and an SFTP page for the machine a pane is on. A host can carry a label, tags and one of
							forty-two system logos.
						</p>
						<p class="muted">
							Connecting is OpenSSH's job: a password, a passphrase or a 2FA push is answered where it always was. A
							password you choose to keep goes into the desktop's keyring, and Tuni never reads it back.
						</p>
					</div>
					<figure class="shot shot-wipe" {@attach reveal(120)}>
						<img
							src="/img/hosts.webp"
							width="1430"
							height="540"
							loading="lazy"
							decoding="async"
							alt="The Connect page: a search field, Local shell, and four recent hosts with Debian, Hetzner, Fedora and Arch logos, their user and address, and tags."
						/>
					</figure>
				</article>

				<article class="feature">
					<div class="feature-copy" {@attach reveal()}>
						<h3>Every action, by name.</h3>
						<p>
							The command palette finds any action with its shortcut beside it. A tab switcher, and find in
							whichever pane has the keyboard.
						</p>
						<p class="muted">Shortcuts are listed and rebound in the settings window.</p>
					</div>
					<figure class="shot shot-wipe" {@attach reveal(120)}>
						<img
							src="/img/palette.webp"
							width="1300"
							height="620"
							loading="lazy"
							decoding="async"
							alt="The command palette over the workspace, searching for tab: New Tab, Reopen Closed Tab, Previous Tab, Rename Tab, Close Tab and Next Tab, each with its shortcut."
						/>
					</figure>
				</article>

				<ul class="cells" role="list">
					{#each cells as [title, text], i (title)}
						<li class="cell" {@attach reveal(i * 70)} {@attach spotlight}>
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
					<p class="eyebrow"><span class="prompt" aria-hidden="true">❯</span> Performance</p>
					<h2>Third of seventeen.</h2>
					<p class="section-lede">
						Throughput for 200 MiB of mixed plain and SGR-colored output, best of two runs on one machine. Within
						10% of the fastest terminal measured and ahead of both GPU terminals, with a whole workspace drawn
						around it.
					</p>
				</div>
				<Bench />
				<p class="muted small">
					Nine of the seventeen shown. The full table, the method and the caveats are in
					<a href="https://github.com/unisic/tuni/blob/main/docs/BENCHMARK.md">docs/BENCHMARK.md</a>.
				</p>
			</div>
		</section>

		<section class="section" id="themes">
			<div class="wrap">
				<div {@attach reveal()}>
					<p class="eyebrow"><span class="prompt" aria-hidden="true">❯</span> Themes</p>
					<h2>574 themes, chrome included.</h2>
					<p class="section-lede">
						Ghostty's whole theme collection. A theme paints the sidebar, the tabs and the panels as well as the
						terminal, so the window is one thing rather than a terminal in a frame. Light and dark can each have
						their own.
					</p>
				</div>
				<Themes />
			</div>
		</section>

		<section class="section section-alt" id="install">
			<div class="wrap">
				<div {@attach reveal()}>
					<p class="eyebrow"><span class="prompt" aria-hidden="true">❯</span> Install</p>
					<h2>One line, then it updates itself.</h2>
					<p class="section-lede">
						The installer's menu says which version is installed, installs or updates to the newest, offers an
						older release, and removes Tuni again. After that Tuni checks the release page once per run and offers
						an Update button that opens the installer in a tab.
					</p>
				</div>

				<CmdCopy command={install} large />

				<div class="install-grid">
					<div class="install-card" {@attach reveal()}>
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
					<div class="install-card" {@attach reveal(90)}>
						<h3>From source</h3>
						<p>
							Needs Rust, GTK4, libadwaita, GtkSourceView and SQLite headers, and Zig 0.15.2, which
							<code>make zig</code> fetches. The three packages and the Flatpak manifest all build this same target.
							<a href="https://github.com/unisic/tuni#building">Building</a> has the details.
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
