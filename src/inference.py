from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

MODEL = "/content/drive/MyDrive/qbreader-llm/model"

tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForCausalLM.from_pretrained(MODEL, device_map="auto")

gen = pipeline("text-generation", model=model, tokenizer=tokenizer, max_length=250)

prompt = "Generate a medium-difficulty quizbowl question about chemistry."
print(gen(prompt, do_sample=True, temperature=0.9)[0]["generated_text"])
