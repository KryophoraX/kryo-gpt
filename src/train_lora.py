from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer, DataCollatorForLanguageModeling
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

MODEL = "microsoft/phi-3-mini-4k-instruct"
DATA = "data/train.jsonl"
OUT = "/content/drive/MyDrive/qbreader-llm/model"

tokenizer = AutoTokenizer.from_pretrained(MODEL, padding_side="left")
model = AutoModelForCausalLM.from_pretrained(MODEL, load_in_4bit=True, device_map="auto")

model = prepare_model_for_kbit_training(model)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj","v_proj"],
    lora_dropout=0.05
)
model = get_peft_model(model, lora_config)

dataset = load_dataset("json", data_files=DATA, split="train")

def preprocess(example):
    full = f"Instruction: {example['instruction']}\nInput: {example['input']}\nOutput:"
    return tokenizer(full, truncation=True, max_length=512)

dataset = dataset.map(preprocess)

training_args = TrainingArguments(
    output_dir=OUT,
    num_train_epochs=3,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    warmup_ratio=0.1,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=20,
    save_strategy="epoch",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
)

trainer.train()
model.save_pretrained(OUT)
