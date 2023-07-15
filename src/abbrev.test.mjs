import assert from "node:assert";
import { test } from "node:test";
import { MessageMock } from "../test/message-mock.mjs";
import { RememberWhenCalled } from "../test/remember-when-called.mjs";
import { Abbrev } from "./abbrev.mjs";
import { linkChain } from "./util.mjs";

test(Abbrev.name, async (t) => {
  await t.test("matches", async (t) => {
    const testCases = [
      ["!abbrev random", "rndm"],
      ["!abbrev user", "usr"],
      ["!abbrev order", "ordr"],
      ["!abbrev random user order", "rndm usr ordr"],
      ["!abbrev doctor", "dctr"],
      ["!abbrev appointment", "apntmnt"],
      ["!abbrev doctor appointment", "dctr apntmnt"],
    ];

    for (const [input, expected] of testCases) {
      await t.test(`for '${input}' returns '${expected}'`, async () => {
        const message = new MessageMock(input);

        await new Abbrev().handle(message);

        assert.deepEqual(message.replies, [expected]);
      });
    }
  });

  await t.test("calls next when it does not match", async (t) => {
    const abbrev = new Abbrev();
    const remember = new RememberWhenCalled();
    const message = new MessageMock("foo");

    await linkChain(abbrev, remember).handle(message);

    assert.deepEqual(message.replies, []);
    assert(remember.called);
  });

  await t.test("ends chain if no message to abbreviate", async (t) => {
    const abbrev = new Abbrev();
    const remember = new RememberWhenCalled();
    const message = new MessageMock("!abbrev");

    await linkChain(abbrev, remember).handle(message);

    assert.deepEqual(message.replies, []);
    assert(!remember.called);
  });
});
