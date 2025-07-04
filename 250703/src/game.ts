import { GameTypes } from './type';
import { Lib } from './lib';
import { Util } from './util';

export class Game {
	private _answerBoard: string[][] = [];
	private _userBoard: string[][] = [];
	private _level: GameTypes.Level | undefined = undefined;
	private _landMine: GameTypes.LandMineData | undefined = undefined;
	private _status: GameTypes.Status = 'not-started';

	public _landMineMap: Map<string, boolean> = new Map();
	public _flagMap: Map<string, boolean> = new Map();

	constructor() {}

	public init(level: GameTypes.Level) {
		this._level = level;
		this._landMine = Lib.landMine[this._level];
		this._status = 'alive';

		this.createBoard();
	}

	public dispose() {
		this._answerBoard = [];
		this._userBoard = [];
		this._level = undefined;
		this._landMine = undefined;
		this._status = 'not-started';
	}

	public status() {
		return this._status;
	}

	public getUserBoard() {
		return this._userBoard;
	}

	public setUserBoard(x: number, y: number, type: 'open' | 'flag') {
		if (type === 'open') {
			if (this._userBoard[y][x] === 'F') return;
			if (this._answerBoard[y][x] === '*') this._status = 'dead';
			else {
				this.openSafeZone(x, y);
				this.isCompleted() && (this._status = 'complete');
			}
		} else if (type === 'flag') {
			const alreadyFlayOn = this._userBoard[y][x] === 'F';

			if (alreadyFlayOn) {
				this._userBoard[y][x] = '.';
				this._flagMap.delete(`${x} ${y}`);
			} else {
				this._userBoard[y][x] = 'F';
				this._flagMap.set(`${x} ${y}`, true);
			}
		}
	}

	public getLandMine() {
		const total = this._landMine?.count!;
		let matchCount = 0;
		Object.keys(this._flagMap).forEach((v) => {
			this._landMineMap.get(v) && (matchCount += 1);
		});

		return { total, rest: total - matchCount };
	}

	private isCompleted() {
		const flattenUserBoard = this._userBoard.flat().join(' ').replace('.', '0').replace('F', '*');
		const flattenAnswerBoard = this._answerBoard.flat().join(' ');

		return flattenUserBoard == flattenAnswerBoard;
	}

	private createBoard() {
		if (!this._landMine) return;

		const { boardN, boardM, count } = this._landMine;
		const landMines = Util.genRandomNum(count, 0, boardN * boardM);
		this._answerBoard = new Array(boardM).fill(0).map(() => new Array(boardN).fill('.'));
		this._userBoard = new Array(boardM).fill(0).map(() => new Array(boardN).fill('.'));

		// 1. 지뢰 Set
		for (const l of landMines) {
			const y = Math.floor(l / boardN);
			const x = l % boardN;
			this._landMineMap.set(`${x} ${y}`, true);
			this._answerBoard[y][x] = '*';
		}

		// 2. 주변 Count Set
		for (let i = 0; i < boardN; i++) {
			for (let j = 0; j < boardM; j++) {
				if (this._answerBoard[j][i] === '*') continue;
				let nearby = 0;

				for (let z = 0; z < 8; z++) {
					const ax = i + Lib.around8.dx[z];
					const ay = j + Lib.around8.dy[z];

					if (ax >= 0 && ax < boardN && ay >= 0 && ay < boardM) {
						this._answerBoard[ay][ax] === '*' && (nearby += 1);
					}
				}
				this._answerBoard[j][i] = nearby.toString();
			}
		}
	}

	private openSafeZone(x: number, y: number) {
		const N = this._landMine!.boardN;
		const M = this._landMine!.boardM;

		const visited = new Array(M).fill(0).map(() => new Array(N).fill(false));

		const queue: number[][] = [[x, y]];
		visited[y][x] = true;
		this._userBoard[y][x] = this._answerBoard[y][x];

		while (queue.length > 0) {
			const [x, y] = queue.pop()!;

			if (
				this._answerBoard[y][x] === '*' ||
				(!isNaN(Number(this._answerBoard[y][x])) && Number(this._answerBoard[y][x]) > 0)
			) {
				break;
			}

			for (let z = 0; z < 8; z++) {
				const ax = x + Lib.around8.dx[z];
				const ay = y + Lib.around8.dy[z];

				if (ax >= 0 && ax < N && ay >= 0 && ay < M) {
					if (this._answerBoard[ay][ax] !== '*' && !visited[ay][ax]) {
						const isVaild = Number(this._answerBoard[y][x]) - Number(this._answerBoard[ay][ax]) < 2;
						if (isVaild) {
							this._userBoard[ay][ax] = this._answerBoard[ay][ax];
							visited[ay][ax] = true;
							queue.push([ax, ay]);
						}
					}
				}
			}
		}
	}
}
