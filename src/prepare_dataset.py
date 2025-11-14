import json

input_file = "data/cleaned.jsonl"
output_file = "data/train.jsonl"

with open(input_file, "r", encoding="utf8") as f:
    rows = [json.loads(x) for x in f]

out = []

for r in rows:
    instruction = "Generate a new quizbowl-style question with similar difficulty and subject matter."
    source_question = r["question"]

    example = {
        "instruction": instruction,
        "input": source_question,
        "output": ""  # model will learn question generation
    }

    out.append(example)

with open(output_file, "w", encoding="utf8") as f:
    for x in out:
        f.write(json.dumps(x, ensure_ascii=False) + "\n")
