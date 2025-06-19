import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

function parse(_path: string) {
	const data = fs.readFileSync(path.join(__dirname, _path));
	return data
		.toString()
		.split('\n')
		.map((line) => line.trim());
}

const targetInput: '3m' | '1m' | 'test' = 'test';

let jsonInput = undefined;
let selectedWordMap: { [key in string]: string[] } = {};

try {
	jsonInput = fs.readFileSync(path.join(__dirname, `../input/${targetInput}.json`), 'utf-8');
} catch (e) {}

if (!jsonInput) {
	const words = parse(`../input/${targetInput}.csv`).slice(1);
	const wordMap: { [key in string]: { [key in string]: number } } = {};

	for (let i = 0; i < words.length; i++) {
		const word = words[i];

		for (let j = 1; j < word.length + 1; j++) {
			const prefix = word.slice(0, j);

			!wordMap[prefix] && (wordMap[prefix] = { [word]: 0 });
			!wordMap[prefix][word] && (wordMap[prefix][word] = 0);

			wordMap[prefix][word] += 1;
		}
	}

	Object.entries(wordMap).forEach(([key, value]) => {
		const sortedValue = Object.entries(value)
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.map((v) => v[0]);
		selectedWordMap[key] = sortedValue.slice(0, 10);
	});

	fs.writeFileSync(path.join(__dirname, `../input/${targetInput}.json`), JSON.stringify(wordMap));
} else {
	selectedWordMap = JSON.parse(jsonInput);
}

const queries = parse('../input/queries.csv').slice(1);

// ----------------------------------------
// findWord 함수를 호출하여 결과를 출력함.
// queries.csv 와 연결할 필요 있음.
// console.log(findWord('WORDHERE'));
// ----------------------------------------

// ----------------------------------------
// Function to find words that start with a given prefix
function findWord(prefix: string): {
	duration: number;
	result: string[];
} {
	const startTime = performance.now();
	const result: string[] = [];

	const word = selectedWordMap[prefix] || [];
	result.push(...word);

	const duration = performance.now() - startTime;

	return {
		duration,
		result,
	};
}

queries.forEach((prefix) => console.log(findWord(prefix)));
