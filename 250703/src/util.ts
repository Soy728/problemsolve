export namespace Util {
	export function genRandomNum(count: number, min: number, max: number) {
		const randomMap: Record<number, boolean> = {};
		const diff = max - min;

		for (let i = 0; i < count; ) {
			const random = Math.floor(Math.random() * diff);
			if (!randomMap[random]) {
				randomMap[random] = true;
				i++;
			}
		}

		return Object.keys(randomMap).map(Number);
	}

	export function formatDuration(ms: number) {
		const date = new Date(ms);

		return `${date.getMinutes()}:${date.getSeconds()}`;
	}
}
