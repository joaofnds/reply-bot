import { devops, eopt, linux } from "../const.mjs";
import { normalize } from "../lib/normalize.mjs";
import { PlainReplier } from "../replier/plain-replier.mjs";
import { ProbPlainReplier } from "../replier/prob-plain-replier.mjs";
import { StupidReplier } from "../replier/stupid-replier.mjs";
import { Chain } from "./chain.mjs";

export class Reply extends Chain {
  constructor(randomFolk) {
    super();
    this.responses = [
      new PlainReplier(eopt, /bolsonaro/gi),
      new PlainReplier(randomFolk, /citando aleatoriamente/gi),
      new PlainReplier(devops, / e devops/gi, /contrat\w* devops/gi),
      new ProbPlainReplier(0.1, linux, /(?<!\/)linux/gi),
      new StupidReplier(
        /(deadline)/gi,
        /(decorator)/gi,
        /(entregar valor)/gi,
        /(firebase)/gi,
        /(legado)/gi,
        /(light mode)/gi,
        /(mape[ai]\w+)/gi,
        /(padra?o\w*)/gi,
        /(pattern)/gi,
        /(seguranca)/gi,
        /(simples\b)/gi,

        /(Api)/g,
        /(Dto)/g,
        /(Http)/g,
        /(Json)/g,
        /(Url)/g,
        /(Uuid)/g
      ),
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
