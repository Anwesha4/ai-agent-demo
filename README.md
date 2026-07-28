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
