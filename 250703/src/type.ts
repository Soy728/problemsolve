export namespace GameTypes {
	export enum Level {
		EASY = 'easy',
		NORMAL = 'normal',
		HARD = 'hard',
	}

	export type LandMineData = { boardN: number; boardM: number; count: number };
	export type Status = 'not-started' | 'alive' | 'dead' | 'complete';
}
