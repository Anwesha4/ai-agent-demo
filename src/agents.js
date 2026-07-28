// import { hugeDocument } from "./sampleData.js";
import { knowledgeBase } from "./sampleData.js";


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Agent 1: Planner
export async function planner(userQuery) {
    await delay(200);
    console.log("\n Planner Agent");

    return {
        task: "Answer the user's question using the knowledge base.",
        userQuery
    };
}

// Agent 2: Retriever
// export function retriever(plan) {
//     console.log("\n Retriever Agent");

//     return {
//         ...plan,
//         context: hugeDocument
//     };
// }



// optimisation 1:

export async function retriever(plan) {

    await delay(300);
    console.log("\nRetriever Agent");

    let context = "";

    const query = plan.userQuery.toLowerCase();

    if (query.includes("oauth")) {
        context = knowledgeBase.oauth;
    }
    else if (query.includes("jwt")) {
        context = knowledgeBase.jwt;
    }
    else if (query.includes("react")) {
        context = knowledgeBase.react;
    }

    return {
        ...plan,
        context
    };
}





// optimisation 2
export function summarize(context) {

    console.log("\nSummarizer Agent");

    // Simulate summarization by keeping only the first 200 words
    return context
        .split(/\s+/)
        .slice(0, 200)
        .join(" ");
}

// Agent 3: Writer
export async function writer(data) {
    await delay(150);
    console.log("\n Writer Agent");

    return `
Question:
${data.userQuery}

Answer:
OAuth allows users to securely authorize applications without sharing passwords.
`;
}