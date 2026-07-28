import { planner, retriever, writer, summarize } from "./agents.js";
import { estimateTokens } from "./tokenizer.js";
import { logStep, success } from "./logger.js";

const query = "Explain OAuth login flow.";

console.log("========== AI PIPELINE ==========");

// ---------------- Planner ----------------

logStep("Planner");

const plannerStart = Date.now();

const plan = await planner(query);

const plannerTime = Date.now() - plannerStart;

success(`Planner completed (${plannerTime} ms)`);

// ---------------- Retriever ----------------

logStep("Retriever");

const retrieverStart = Date.now();

const retrieved = await retriever(plan);

const retrieverTime = Date.now() - retrieverStart;

success(`Retriever completed (${retrieverTime} ms)`);

// ---------------- Token Analysis ----------------

const beforeSummaryTokens = estimateTokens(retrieved.context);

console.log(`\nTokens Before Summary: ${beforeSummaryTokens}`);

// ---------------- Summarizer ----------------

logStep("Summarizer");

const summarizedContext = summarize(retrieved.context);

success("Context compressed");

const afterSummaryTokens = estimateTokens(summarizedContext);

console.log(`Tokens After Summary: ${afterSummaryTokens}`);

// ---------------- Writer ----------------

logStep("Writer");

const writerStart = Date.now();

const answer = await writer({
    ...retrieved,
    context: summarizedContext
});

const writerTime = Date.now() - writerStart;

success(`Writer completed (${writerTime} ms)`);

// ---------------- Final Output ----------------

console.log("\n========== FINAL ANSWER ==========\n");
console.log(answer);
// console.log("\nRaw Writer Output:");
// console.log(answer);

// try {

//     const parsed = JSON.parse(answer);

//     console.log(parsed);

// }
// catch(err){

//     console.log("\n❌ JSON Parsing Failed");
//     console.log(err.message);

// }

console.log(`\nEstimated Input Tokens: ${afterSummaryTokens}`);

console.log("\n========== PIPELINE COMPLETED ==========");