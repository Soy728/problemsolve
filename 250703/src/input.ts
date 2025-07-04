import readline from 'readline';

export class Input {
	private rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	public async on(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.rl.once('line', (line: string) => {
				resolve(line);
				// this.rl.close();
			});
		});
	}
}
