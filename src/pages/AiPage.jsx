import { useState } from 'react'
import { loadInventory } from '../utils/inventory'

const customSystemPrompt = `You are the AI assistant for VORLAN, a local business management system. You have access to this business's inventory: [paste fake product list]. You can help with reminders, inventory questions, scheduling, and general business tasks. Be concise and practical`

async function queryOpenAI(apiKey, userMessage, systemText) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemText },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI request failed')
  }
  return data.choices?.[0]?.message?.content || 'No response'
}

async function queryAnthropic(apiKey, userMessage, systemText) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-latest',
      system: systemText,
      max_tokens: 300,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error?.message || 'Anthropic request failed')
  }
  return data.content?.[0]?.text || 'No response'
}

async function queryOllama(model, messages, systemText) {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: { temperature: 0.2 },
      system: systemText,
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Local LLM request failed')
  }
  return data.message?.content || 'No response'
}

function queryLocalFallback(userMessage) {
  const rows = loadInventory()
  const lowStock = rows.filter((item) => Number(item.qty) <= Number(item.reorderLevel || 0))
  const text = userMessage.toLowerCase()

  if (text.includes('low') || text.includes('reorder')) {
    if (!lowStock.length) return 'All tracked items are currently above reorder levels.'
    return `Low stock items: ${lowStock
      .map((item) => `${item.item} (${item.qty}, reorder ${item.reorderLevel})`)
      .join('; ')}.`
  }

  if (text.includes('inventory') || text.includes('stock')) {
    return `Inventory has ${rows.length} items. Top quantities: ${rows
      .slice(0, 3)
      .map((item) => `${item.item} (${item.qty})`)
      .join(', ')}.`
  }

  if (text.includes('schedule') || text.includes('reminder')) {
    return 'Scheduling tip: prioritize restock tasks for low inventory before daily closing.'
  }

  return `I can help with inventory and operations. Current tracked items: ${rows
    .map((item) => item.item)
    .slice(0, 5)
    .join(', ')}. Ask me about low stock, reorder planning, or scheduling.`
}

function AiPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [threadMessages, setThreadMessages] = useState({
    default: [{ role: 'assistant', content: 'Ask me about inventory, device stock, or storage planning.' }],
  })
  const [threads, setThreads] = useState([
    { id: 'default', title: 'Today\'s operations', createdAt: new Date().toISOString() },
  ])
  const [activeThreadId, setActiveThreadId] = useState('default')

  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  const ollamaModel =
    import.meta.env.VITE_OLLAMA_MODEL || 'hf.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF:Q4_K_M'

  const messages = threadMessages[activeThreadId] || []

  const getInventoryPrompt = () => {
    const rows = loadInventory()
    const currentInventory = rows
      .map((item) => `${item.sku}: ${item.item}, qty ${item.qty}, location ${item.location}`)
      .join('\n')
    return `${customSystemPrompt}\n\nLive inventory list:\n${currentInventory}`
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')
    const userMessage = { role: 'user', content: userText }
    setThreadMessages((prev) => {
      const updatedThread = [...(prev[activeThreadId] || []), userMessage]
      return {
        ...prev,
        [activeThreadId]: updatedThread,
      }
    })
    setLoading(true)
    try {
      const currentMessages = [...(threadMessages[activeThreadId] || []), userMessage]
      const enrichedPrompt = getInventoryPrompt()
      const reply = await queryOllama(ollamaModel, currentMessages, enrichedPrompt).catch(async () => {
        if (openAiKey) return queryOpenAI(openAiKey, userText, enrichedPrompt)
        if (anthropicKey) return queryAnthropic(anthropicKey, userText, enrichedPrompt)
        return queryLocalFallback(userText)
      })

      setThreadMessages((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), { role: 'assistant', content: reply || 'No response' }],
      }))
    } catch (error) {
      setThreadMessages((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), { role: 'assistant', content: queryLocalFallback(userText) }],
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page ai-layout">
      <aside className="ai-sidebar card">
        <div className="widget-head">
          <h3>Recent chats</h3>
          <button
            className="ghost-btn mini-btn"
            type="button"
            onClick={() => {
              const id = Date.now().toString()
              const title = 'New session'
              setThreads((prev) => [{ id, title, createdAt: new Date().toISOString() }, ...prev])
              setThreadMessages((prev) => ({
                ...prev,
                [id]: [{ role: 'assistant', content: 'New chat created. Ask me about inventory or operations.' }],
              }))
              setActiveThreadId(id)
            }}
          >
            + New
          </button>
        </div>
        <ul className="thread-list">
          {threads.map((thread) => (
            <li
              key={thread.id}
              className={thread.id === activeThreadId ? 'thread active' : 'thread'}
              onClick={() => setActiveThreadId(thread.id)}
            >
              <span>{thread.title}</span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="ai-main">
        <header>
          <h1>AI assistant</h1>
          <p className="subtle">Ask anything about inventory, devices, or storage health.</p>
          <p className="muted small-text">Model preference: local TheBloke-compatible Ollama model.</p>
        </header>
        <section className="chat-box card">
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </section>
        <section className="ai-input-shell">
          <div className="field-label">Ask a question</div>
          <div className="ai-input-bar">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder=""
            />
            <button className="primary-btn ask-btn" onClick={sendMessage} disabled={loading}>
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
          <p className="muted small-text">
            Example: &quot;Which items are closest to their reorder point?&quot;
          </p>
        </section>
      </section>
    </main>
  )
}

export default AiPage
