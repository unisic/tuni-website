<script>
	/** @type {{ command: string, large?: boolean }} */
	let { command, large = false } = $props();

	let copied = $state(false);
	let failed = $state(false);
	let timer = 0;

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
			copied = true;
		} catch {
			failed = true;
		}
		clearTimeout(timer);
		timer = setTimeout(() => (copied = failed = false), 1600);
	}

	$effect(() => () => clearTimeout(timer));
</script>

<div class="cmd" class:cmd-lg={large} role="group" aria-label="Install command">
	<span class="cmd-prompt" aria-hidden="true">$</span>
	<code class="cmd-text">{command}</code>
	<button class="copy" class:copied type="button" onclick={copy} aria-live="polite">
		{copied ? 'Copied' : failed ? 'Select it' : 'Copy'}
	</button>
</div>
