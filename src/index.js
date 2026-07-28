import { planner, retriever, writer, summarize } from "./agents.js";
import { estimateTokens } from "./tokenizer.js";
import { logStep, success } from "./logger.js";

const query = "Explain OAuth login flow.";

console.log("========== AI PIPELINE ==========");

// ---------------- Planner ----------------

logStep("Planner");

const plan = await planner(query);

success("Planner completed");

// ---------------- Retriever ----------------

logStep("Retriever");

const retrieved = await retriever(plan);

success("Retriever completed");

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

const answer = await writer({
    ...retrieved,
    context: summarizedContext
});

success("Writer completed");

// ---------------- Final Output ----------------

console.log("\n========== FINAL ANSWER ==========\n");

console.log(answer);

console.log(`\nEstimated Input Tokens: ${afterSummaryTokens}`);

console.log("\n========== PIPELINE COMPLETED ==========");