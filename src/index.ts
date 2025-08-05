/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your Worker in action
 * - Run `npm run deploy` to publish your Worker
 *
 * Bind resources to your Worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

function toBase64(buffer: ArrayBuffer) {
	const bytes = new Uint8Array(buffer);
	const binString = Array.from(bytes, (byte) =>
		String.fromCodePoint(byte),
	).join("");
	return btoa(binString);
}

async function sign(timestamp: number, secret: string): Promise<string> {
	const keyData = new TextEncoder().encode(`${timestamp}\n${secret}`);
	const key = (await crypto.subtle.importKey(
		"raw",
		keyData,
		{
			name: "HMAC",
			hash: "SHA-256",
		},
		false,
		["sign", "verify"],
	)) as CryptoKey;

	const signature = await crypto.subtle.sign("HMAC", key, new Uint8Array());

	return toBase64(signature);
}

export default {
	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// [[triggers]] configuration.
	async scheduled(event, env, _ctx): Promise<void> {
		try {
			const date = new Date();
			const timestamp = date.valueOf() / 1000;
			const signature = await sign(timestamp, env.SECRET ?? "");
			const body = JSON.stringify({
				timestamp: timestamp.toString(),
				sign: signature,
				msg_type: "text",
				content: {
					text: '<at user_id="all">所有人</at>，这周的理智药水喝了吗？',
				},
			});

			const response = await (
				await fetch(env.WEBHOOK_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body,
				})
			).text();

			// You could store this result in KV, write to a D1 Database, or publish to a Queue.
			// In this template, we'll just log the result:
			console.log(
				`trigger fired at ${date.toISOString()} by ${event.cron}: ${response}`,
			);
		} catch (e) {
			console.log(e);
		}
	},
} satisfies ExportedHandler<Env>;
