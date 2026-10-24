// Attachments for the page's motion. Each one is a no-op under
// prefers-reduced-motion: the CSS then shows the finished state.

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** @type {IntersectionObserver | undefined} */
let observer;
/** @type {WeakMap<Element, () => void>} */
const onIn = new WeakMap();

/**
 * Adds `is-in` once the element scrolls into view, then forgets it, so the
 * one observer the page shares only ever holds what has not appeared yet.
 * @param {number} [delay] ms, for staggering siblings
 * @param {() => void} [then] called once, when it appears
 * @returns {import('svelte/attachments').Attachment<HTMLElement>}
 */
export function reveal(delay = 0, then) {
	return (node) => {
		if (delay) node.style.setProperty('--delay', `${delay}ms`);
		if (reduced()) {
			node.classList.add('is-in');
			return;
		}
		observer ??= new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add('is-in');
					onIn.get(entry.target)?.();
					onIn.delete(entry.target);
					observer?.unobserve(entry.target);
				}
			},
			{ rootMargin: '0px 0px -12% 0px' }
		);
		if (then) onIn.set(node, then);
		node.classList.add('will-reveal');
		observer.observe(node);
		return () => {
			onIn.delete(node);
			observer?.unobserve(node);
		};
	};
}

/**
 * Writes scroll progress through the first `span` px of the page into
 * `--progress` (0 to 1). One passive listener, at most one write a frame.
 * @param {number} span
 * @returns {import('svelte/attachments').Attachment<HTMLElement>}
 */
export function scrollProgress(span) {
	return (node) => {
		if (reduced()) {
			node.style.setProperty('--progress', '1');
			return;
		}
		let frame = 0;
		const update = () => {
			frame = 0;
			const p = Math.min(1, Math.max(0, scrollY / span));
			node.style.setProperty('--progress', p.toFixed(3));
		};
		const onScroll = () => {
			frame ||= requestAnimationFrame(update);
		};
		update();
		addEventListener('scroll', onScroll, { passive: true });
		return () => {
			removeEventListener('scroll', onScroll);
			cancelAnimationFrame(frame);
		};
	};
}

/**
 * Tracks the pointer inside the element as `--mx` / `--my`, for a light that
 * follows it. Style writes only; no layout is read past the one rect.
 * @type {import('svelte/attachments').Attachment<HTMLElement>}
 */
export function spotlight(node) {
	const move = (/** @type {PointerEvent} */ e) => {
		const r = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${e.clientX - r.left}px`);
		node.style.setProperty('--my', `${e.clientY - r.top}px`);
	};
	node.addEventListener('pointermove', move);
	return () => node.removeEventListener('pointermove', move);
}
