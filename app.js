function App() {
  import React, { useState } from 'react'

// qbreader-llm GitHub Page - single-file React app
// - Uses Tailwind classes (no imports required in canvas preview)
// - Default export is the App component
// - Replace placeholder endpoints with your GitHub/HF/Colab URLs

export default function App(){
  const [topic, setTopic] = useState('World Capitals')
  const [generated, setGenerated] = useState('')
  const [datasetName, setDatasetName] = useState('No file chosen')
  const [training, setTraining] = useState(false)
  const [colabUrl, setColabUrl] = useState('https://colab.research.google.com/')

  // Placeholder: call your inference endpoint here (Hugging Face, self-hosted, or Colab)
  async function generateQuestion(){
    setGenerated('Generating...')
    try{
      // Example: fetch('/api/generate', {method:'POST', body: JSON.stringify({topic})})
      // Replace below with real request to your inference endpoint
      await new Promise(r=>setTimeout(r,800))
      const out = `\nQ: (Generated) This city is the capital of its country and is known for X. Name the city.\nAnswer: ExampleCity`
      setGenerated(out)
    }catch(e){
      setGenerated('Error generating question. Check endpoint.')
    }
  }

  function handleFile(e){
    const f = e.target.files?.[0]
    if(f) setDatasetName(f.name)
  }

  function startTraining(){
    // Optionally open the Colab notebook for the user
    setTraining(true)
    window.open(colabUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">QB</div>
            <div>
              <h1 className="text-lg font-semibold">QBReader LLM — Question Generator</h1>
              <p className="text-xs text-slate-500">Fine-tune, generate, and explore quizbowl-style questions</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <a className="px-3 py-2 rounded hover:bg-slate-100" href="#generate">Generate</a>
            <a className="px-3 py-2 rounded hover:bg-slate-100" href="#dataset">Dataset</a>
            <a className="px-3 py-2 rounded bg-indigo-600 text-white" href="#train">Train</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-6 items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-3">Create a custom question-generator from QBReader data</h2>
            <p className="text-slate-600 mb-4">With permission to use qbreader data, you can fine-tune a small instruction-tuned model to generate new, high-quality quizbowl questions. This page scaffolds the UI to upload datasets, start training on Colab, and generate new questions.</p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Scrape & prepare dataset → JSONL instruction format</li>
              <li>• Upload or link dataset to Google Drive / GitHub</li>
              <li>• Fine-tune with QLoRA on Colab</li>
              <li>• Deploy inference endpoint to Hugging Face or a small VM</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <button onClick={()=>document.getElementById('dataset-panel')?.scrollIntoView({behavior:'smooth'})} className="px-4 py-2 bg-indigo-600 text-white rounded">Prepare dataset</button>
              <button onClick={()=>document.getElementById('train')?.scrollIntoView({behavior:'smooth'})} className="px-4 py-2 border rounded">Open training</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">Quick start</h3>
            <ol className="list-decimal pl-5 text-slate-600 text-sm">
              <li>Scrape allowed pages and save to <code>cleaned.jsonl</code>.</li>
              <li>Run <code>prepare_dataset.py</code> to transform to instruction JSONL.</li>
              <li>Open the training Colab notebook and connect your Google Drive.</li>
              <li>Train with QLoRA and save the LoRA weights to Drive.</li>
              <li>Deploy weights to an API and enter the endpoint below.</li>
            </ol>

            <div className="mt-4">
              <label className="text-xs text-slate-500">Inference endpoint (optional)</label>
              <input className="mt-1 w-full border rounded p-2 text-sm" placeholder="https://api.your-host/model"/>
              <p className="text-xs text-slate-400 mt-2">Leave blank to test with the demo generator.</p>
            </div>
          </div>
        </section>

        {/* Generate */}
        <section id="generate" className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">Generate a question</h3>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-slate-600">Topic / Seed</label>
              <input value={topic} onChange={e=>setTopic(e.target.value)} className="mt-2 w-full border rounded p-3" />

              <div className="flex gap-2 mt-4">
                <button onClick={generateQuestion} className="px-4 py-2 bg-indigo-600 text-white rounded">Generate</button>
                <button onClick={()=>{ setGenerated(''); setTopic('') }} className="px-4 py-2 border rounded">Clear</button>
              </div>
            </div>

            <div className="flex-1">
              <label className="text-sm text-slate-600">Generated Question</label>
              <pre className="mt-2 p-4 h-40 overflow-auto bg-slate-50 border rounded text-sm whitespace-pre-wrap">{generated || 'No question yet — click Generate.'}</pre>
            </div>
          </div>

        </section>

        {/* Dataset upload */}
        <section id="dataset-panel" className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">Dataset & Upload</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Upload your prepared <code>train.jsonl</code> (instruction format) or connect a Google Drive folder.</p>
              <div className="mt-3">
                <label className="block text-xs text-slate-500">Upload file</label>
                <input type="file" accept="application/jsonl,.jsonl,.json" onChange={handleFile} className="mt-2" />
                <p className="text-xs text-slate-400 mt-2">{datasetName}</p>
              </div>

              <div className="mt-4">
                <label className="block text-xs text-slate-500">Or paste a Google Drive share link</label>
                <input placeholder="https://drive.google.com/drive/folders/..." className="mt-2 w-full border rounded p-2 text-sm" />
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-600">Dataset preview (first 3 examples)</p>
              <div className="mt-2 text-sm text-slate-700 bg-slate-50 border rounded p-3 h-40 overflow-auto">
                <code>1. Generate a new quizbowl-style question similar to the input question.\n2. ...</code>
              </div>

              <div className="mt-4">
                <button className="px-4 py-2 bg-emerald-600 text-white rounded">Validate dataset</button>
                <button className="px-4 py-2 border rounded ml-2">Format & Download</button>
              </div>
            </div>
          </div>
        </section>

        {/* Training */}
        <section id="train" className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-xl font-semibold mb-3">Training (Colab / QLoRA)</h3>

          <p className="text-slate-600 text-sm">Click <strong>Start training</strong> to open the Colab notebook prefilled with your Drive paths. The notebook will mount Drive, install deps, and begin LoRA fine-tuning. Save checkpoints to Drive frequently.</p>

          <div className="mt-4 flex gap-3">
            <button onClick={startTraining} className="px-4 py-2 bg-indigo-600 text-white rounded">Start training in Colab</button>
            <button onClick={()=>alert('Open Colab notebook URL (customize in code)')} className="px-4 py-2 border rounded">Open notebook</button>
            <div className="ml-auto text-sm text-slate-500">Status: {training ? 'Running in Colab' : 'Idle'}</div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded">
              <h4 className="font-semibold">Recommended model</h4>
              <p className="text-xs text-slate-600">Phi-3 Mini or a 3B instruction model. Use QLoRA on an A100 or T4.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded">
              <h4 className="font-semibold">Training tips</h4>
              <ul className="text-xs text-slate-600 list-disc pl-4">
                <li>Use small batch sizes + gradient accumulation</li>
                <li>Save LoRA checkpoints every epoch</li>
                <li>Validate on held-out dev set</li>
              </ul>
            </div>
            <div className="p-3 bg-slate-50 rounded">
              <h4 className="font-semibold">Deploy</h4>
              <p className="text-xs text-slate-600">Upload LoRA weights to Hugging Face or host an inference server. Then paste the endpoint above in Quick Start.</p>
            </div>
          </div>
        </section>

        <footer className="text-center text-sm text-slate-500 py-6">
          <div>Made for QBReader LLM project • Please only use data you have permission to use</div>
        </footer>
      </main>
    </div>
  )
}

}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);