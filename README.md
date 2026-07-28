# Part 1 – Token/Cost Optimization

## Objective

Reduce token usage in a simple multi-agent AI pipeline while maintaining response quality.

### Pipeline

```text
User → Planner → Retriever → Writer → Response
```

* **Planner:** Identifies the user's task.
* **Retriever:** Fetches relevant context.
* **Writer:** Generates the final response.

---

## Baseline

For the query:

> **"Explain OAuth login flow."**

the Retriever passed the entire knowledge base to the Writer.

| Version           | Estimated Tokens |
| ----------------- | ---------------: |
| Original Pipeline |       **11,700** |

---

## Optimization 1 – Relevant Context Retrieval

**Problem:** The Retriever always returned the full knowledge base.

**Solution:** Split the knowledge base into topic-specific documents (OAuth, JWT, React) and return only the document relevant to the user's query.

| Version | Estimated Tokens |
| ------- | ---------------: |
| Before  |           11,700 |
| After   |        **2,652** |

**Quality Tradeoff:** Minimal, since only irrelevant documents are removed.

---

## Optimization 2 – Context Compression (Simulated)

**Problem:** The retrieved document can still be larger than necessary.

**Solution:** Compress the retrieved context before passing it to the Writer. In this demo, compression is simulated by reducing the context size. In production, this would typically be replaced with an LLM-based summarization step.

| Version            |          Estimated Tokens |
| ------------------ | ------------------------: |
| Before Compression |                     2,652 |
| After Compression  | **<your measured value>** |

**Quality Tradeoff:** Compression reduces token usage further but may omit some details if overused.

---

## Summary

| Stage               |      Estimated Tokens |
| ------------------- | --------------------: |
| Original Pipeline   |                11,700 |
| Relevant Retrieval  |                 2,652 |
| Context Compression | <your measured value> |

### Key Takeaways

* Retrieving only relevant context provides the biggest reduction in token usage.
* Context compression can further reduce costs when needed.
* Together, these techniques make AI pipelines more cost-efficient while maintaining output quality.





# Part 2 – Debugging

## Objective

The objective was to simulate common failures in a multi-agent AI pipeline and demonstrate a systematic approach to identifying and isolating the root cause of each issue.

---

## Pipeline

```text
User → Planner → Retriever → Summarizer → Writer → Response
```

To aid debugging, execution logs and execution times were added for each stage.

Example:

```text
========== Planner ==========
Planner completed (202 ms)

========== Retriever ==========
Retriever completed (305 ms)

========== Summarizer ==========
Context compressed

========== Writer ==========
Writer completed (151 ms)
```

---

## Scenario 1 – Timeout

### Simulated Issue

The Retriever Agent was intentionally delayed by increasing its execution time from **300 ms** to **6000 ms**.

### Output

```text
========== Planner ==========
Planner completed (201 ms)

========== Retriever ==========
Retriever completed (6005 ms)

========== Writer ==========
Writer completed (150 ms)
```

### Debugging Process

1. Measured the execution time of each pipeline stage.
2. Compared the execution times.
3. Identified the Retriever Agent as the bottleneck.
4. Investigated possible causes such as slow document retrieval, external API latency, retry loops, or network delays.

**Root Cause:** High latency in the Retriever Agent.

---

## Scenario 2 – Malformed Output

### Simulated Issue

The Writer Agent was modified to return conversational text before a JSON object.

### Writer Output

```text
Sure! Here's the answer.

{
    "answer":"OAuth allows users to securely authorize applications without sharing passwords."
}
```

### Parsing Output

```text
JSON Parsing Failed

Unexpected token 'S'
```

### Debugging Process

1. Logged the raw Writer output.
2. Compared it with the expected JSON format.
3. Identified that extra text before the JSON payload caused the parser to fail.
4. Recommended using structured JSON output, response validation, and retry logic.

**Root Cause:** Invalid response format.

---

## Scenario 3 – Incorrect Retrieval (Silent Failure)

### Simulated Issue

The Retriever Agent was intentionally configured to return the React documentation for an OAuth query.

### User Query

```text
Explain OAuth login flow.
```

### Retrieved Context

```text
React is a JavaScript library for building user interfaces using reusable components...
```

### Final Output

```text
Question:
Explain OAuth login flow.

Answer:
React is a JavaScript library for building user interfaces.
```

Although the pipeline completed successfully, the generated response was incorrect because the wrong context was retrieved.

### Debugging Process

1. Verified the user's query.
2. Logged the retrieved context.
3. Compared the retrieved document with the expected topic.
4. Identified that the Retriever Agent selected the wrong document.
5. Corrected the retrieval logic.

**Root Cause:** Incorrect document retrieval.

---

## Key Takeaways

* Measuring execution time helps isolate performance bottlenecks.
* Logging intermediate outputs makes formatting issues easier to identify.
* Inspecting retrieved context helps detect silent failures where the pipeline succeeds but produces incorrect results.
* A stage-by-stage debugging approach is more effective than treating the pipeline as a single black box.
