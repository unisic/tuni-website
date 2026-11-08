<script>
	import { reveal } from '#lib/motion.js';
</script>

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
				<li><a href="https://ko-fi.com/unisic">Support on Ko-fi</a></li>
			</ul>
		</div>
	</div>
</footer>
