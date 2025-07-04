import { GameTypes } from './type';
export namespace Lib {
	export const landMine: Record<GameTypes.Level, GameTypes.LandMineData> = {
		[GameTypes.Level.EASY]: { boardN: 9, boardM: 9, count: 10 },
		[GameTypes.Level.NORMAL]: { boardN: 16, boardM: 16, count: 40 },
		[GameTypes.Level.HARD]: { boardN: 30, boardM: 16, count: 99 },
	};

	export const around8 = {
		dx: [0, 0, -1, 1, -1, -1, 1, 1],
		dy: [-1, 1, 0, 0, -1, 1, -1, 1],
	};

	export const around4 = {
		dx: [1, 0, -1, 0],
		dy: [0, 1, 0, -1],
	};
}
