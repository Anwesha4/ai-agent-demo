import test from "node:test";
import assert from "node:assert";
import { estimateTokens } from "../src/tokenizer.js";

test("estimateTokens returns a positive value", () => {

    const tokens = estimateTokens("Hello World");

    assert(tokens > 0);

});