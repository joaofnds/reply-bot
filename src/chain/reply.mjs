import {
	anonymous,
	bun,
	cLigaMeu,
	devops,
	eopt,
	feijoada,
	firebase,
	linux,
	nani,
} from "../const.mjs";
import { normalize } from "../lib/normalize.mjs";
import { PlainReplier } from "../replier/plain-replier.mjs";
import { ProbPlainReplier } from "../replier/prob-plain-replier.mjs";
import { SoundCloudReplier } from "../replier/soundcloud-replier.mjs";
import { StupidReplier } from "../replier/stupid-replier.mjs";
import { WebhookBotPlanReplier } from "../replier/webhook-bot-plain-replier.mjs";
import { Chain } from "./chain.mjs";

export class Reply extends Chain {
	constructor({ randomFolk, bunBot }) {
		super();
		this.responses = [
			new PlainReplier("Barros!", /e o pedro/gi),
			new PlainReplier(eopt, /bolsonaro/gi, /mas e [oa] .* hein/gi),
			new PlainReplier(randomFolk, /citando aleatoriamente/gi),
			new PlainReplier(devops, / (e|sou|os) devops/gi, /contrat\w* devops/gi),
			new PlainReplier(anonymous, /anonymous/gi, /anonimo/gi),
			new PlainReplier(nani, /(^|[^\?])\?{3}$/),
			new PlainReplier(feijoada, /feij\w+/gi, /nada acontece/gi),
			new PlainReplier(cLigaMeu, /c liga meu/gi, /agencia do nubank/gi),
			new ProbPlainReplier(0.1, linux, /(?<!\/)linux/gi),
			new ProbPlainReplier(0.01, firebase, /firebase/gi),
			new StupidReplier(
				/(deadline)/gi,
				/(entregar valor)/gi,
				/(estima\w+)/gi,
				/(legado)/gi,
				/(light mode)/gi,
				/(mape[ai]\w+)/gi,
				/(padron\w+)/gi,
				/(seguranca)/gi,
				/(simples\b)/gi,
				/(Api)/g,
				/(Dto)/g,
				/(Http)/g,
				/(Json)/g,
				/(Url)/g,
				/(Uuid)/g,
			),
			new WebhookBotPlanReplier(bunBot, bun, /\bbun\b/gi),
			new SoundCloudReplier(),
		];
	}

	async handle(message) {
		const str = normalize(message.content);

		for (const response of this.responses) {
			const reply = response.reply(str);
			if (reply) return message.reply(reply);
		}

		this.next?.handle(message);
	}
}
