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
const words = parse(`../input/${targetInput}.csv`).slice(1);

class Node {
	children: Map<string, Node> = new Map();
	count: number = 0;
}

class Root {
	private root: Node = new Node();

	insert(word: string) {
		let node = this.root;

		for (const char of word) {
			const child = node.children.get(char);
			if (!child) {
				node.children.set(char, new Node());
			} else {
				node = child;
			}
		}
		node.count += 1;
	}

	find(prefix: string): string[] {
		return [];
	}

	getWords(prefix: string): string[] {
		const result: { word: string; count: number }[] = [];
		const prefixNode = this.find(prefix);
		if (!prefixNode) return [];

		return result
			.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
			.slice(0, 10)
			.map((e) => e.word);
	}
}

const root = new Root();
for (const word of words) {
	root.insert(word);
}

const queries = parse('../input/queries.csv').slice(1);

function findWord(prefix: string): {
	duration: number;
	result: string[];
} {
	const startTime = performance.now();

	const result = root.getWords(prefix);

	const duration = performance.now() - startTime;
	return { duration, result: result.length ? result : ['없음'] };
}

for (const q of queries) {
	const { duration, result } = findWord(q);
	console.log(duration, result);
}
