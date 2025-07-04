import { Util } from './util';
import { Game } from './game';
import { Input } from './input';
import { GameTypes } from './type';

const input = new Input();
let game = new Game();
let currentLevel: GameTypes.Level;

async function main() {
	while (true) {
		await setLevel();
		await run();
		const restart = await isReplay();
		if (!restart) break;
	}
}

(async () => {
	await main();
})();

async function setLevel() {
	console.log('난이도를 선택하세요 (easy, normal, hard):');
	const level = await input.on();
	currentLevel = level as GameTypes.Level;
	game.init(currentLevel);
}

async function isReplay(): Promise<boolean> {
	console.log('다시 시작하시겠습니까? (y/n):');
	const answer = await input.on();
	return answer.toLowerCase() === 'y';
}

async function run() {
	const start = Date.now();

	while (true) {
		console.clear();
		console.log(game.getLandMine());
		console.table(game.getUserBoard());

		console.log('입력:');
		const text = await input.on();

		if (text === 'r') {
			game.init(currentLevel);
			continue;
		}

		if (text === 'q') {
			break;
		}

		if (text.startsWith('f')) {
			const [f, x, y] = text.split(' ');
			game.setUserBoard(Number(x), Number(y), 'flag');
		} else {
			const [x, y] = text.split(' ');
			game.setUserBoard(Number(x), Number(y), 'open');
		}

		const status = game.status();

		if (status === 'dead' || status === 'complete') {
			console.clear();
			console.log(status === 'dead' ? '게임 오버' : '게임 클리어');
			console.log(`소요시간: ${Util.formatDuration(Date.now() - start)}`);
			console.table(game.getLandMine());
			break;
		}
	}
}
