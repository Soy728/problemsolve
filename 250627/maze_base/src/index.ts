import fs from 'fs';
import path from 'path';
const mazeArr = [
	'10x10',
	'100x100_1',
	'100x100_2',
	'100x100_3',
	'300x300_1',
	'300x300_2',
	'300x300_3',
	'300x300_4',
	'300x300_5',
	'1000x1000_1',
	'1000x1000_2',
];
function execute(maze: string) {
	const data = fs.readFileSync(path.join(__dirname, `../map/maze_${maze}.txt`));
	const map = data.toString();
	const startTime = performance.now();
	const result = findPath(map);
	const duration = performance.now() - startTime;

	console.log(`[${maze}]`);
	console.log(`Duration: ${duration} ms`);
	console.log(`Result: ${result}`);
	console.log(`\n`);
}
function findPath(map: any): string {
	const maps = (map.split('\n') as string[])
		.filter((v) => !!v)
		.map((v) => v.split(' ').filter((v) => !!v));

	const N = maps[0].length;
	const M = maps.length;
	const visited = new Array(M).fill(0).map(() => new Array(N).fill(false));

	const portalMap: { [key in string]: { x: number; y: number }[] } = {};
	maps.forEach((m, j) =>
		m.forEach((n, i) => {
			if (!isNaN(Number(n))) {
				if (portalMap[n]) portalMap[n].push({ x: i, y: j });
				else {
					portalMap[n] = [{ x: i, y: j }];
				}
			}
		})
	);

	let queue: { x: number; y: number; count: number }[] = [];
	queue.push({ x: 0, y: 0, count: 0 });
	visited[0][0] = true;
	let leastCount = -1;

	while (queue.length > 0) {
		const { x, y, count } = queue.shift()!;

		if (maps[y][x] === '.E') {
			leastCount = count;
			break;
		}

		const dx = [1, 0, -1, 0];
		const dy = [0, 1, 0, -1];

		for (let i = 0; i < 4; i++) {
			const ax = x + dx[i];
			const ay = y + dy[i];

			if (ax >= 0 && ax < N && ay >= 0 && ay < M) {
				if (visited[ay][ax] == false && maps[ay][ax] !== '#') {
					visited[ay][ax] = true;
					if (!isNaN(Number(maps[ay][ax]))) {
						const portals = portalMap[maps[ay][ax]];
						const target = portals.find((v) => v.x !== ax && v.y !== ay)!;

						if (!visited[target.y][target.x]) {
							queue.push({ x: target.x, y: target.y, count: count + 1 });
							visited[target.y][target.x] = true;
						}
					} else {
						queue.push({ x: ax, y: ay, count: count + 1 });
					}
				}
			}
		}
	}

	return leastCount === -1 ? 'NO' : String(leastCount);
}

mazeArr.forEach((maze) => execute(maze));
