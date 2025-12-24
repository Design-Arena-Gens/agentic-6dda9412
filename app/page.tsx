'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [telegramGroups, setTelegramGroups] = useState('')
  const [facebookGroups, setFacebookGroups] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post('/api/process', {
        youtubeUrl,
        telegramGroups: telegramGroups.split('\n').filter(g => g.trim()),
        facebookGroups: facebookGroups.split('\n').filter(g => g.trim()),
      })

      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          YouTube para Blog Automation
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Transforme vídeos do YouTube em artigos otimizados e compartilhe automaticamente
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL do Vídeo do YouTube
            </label>
            <input
              type="text"
              id="youtube"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grupos do Telegram (um por linha)
            </label>
            <textarea
              id="telegram"
              value={telegramGroups}
              onChange={(e) => setTelegramGroups(e.target.value)}
              placeholder="@grupo1&#10;@grupo2&#10;@grupo3"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grupos do Facebook (um por linha)
            </label>
            <textarea
              id="facebook"
              value={facebookGroups}
              onChange={(e) => setFacebookGroups(e.target.value)}
              placeholder="Nome do Grupo 1&#10;Nome do Grupo 2"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : 'Gerar Artigo e Compartilhar'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">
                ✓ Processamento Concluído!
              </h2>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Informações do Vídeo
              </h3>
              <p className="text-gray-700 dark:text-gray-300"><strong>Título:</strong> {result.videoTitle}</p>
              <p className="text-gray-700 dark:text-gray-300"><strong>Canal:</strong> {result.channelName}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Artigo Gerado
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm">
                  {result.article}
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Palavras: {result.wordCount}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Status de Compartilhamento
              </h3>

              {result.sharing.telegram && result.sharing.telegram.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Telegram:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.sharing.telegram.map((item: any, idx: number) => (
                      <li key={idx} className={item.success ? 'text-green-600' : 'text-red-600'}>
                        {item.group}: {item.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.sharing.facebook && result.sharing.facebook.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Facebook:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.sharing.facebook.map((item: any, idx: number) => (
                      <li key={idx} className={item.success ? 'text-green-600' : 'text-red-600'}>
                        {item.group}: {item.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
                Otimizações SEO Aplicadas
              </h3>
              <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
                <li>Estrutura HTML semântica com tags apropriadas</li>
                <li>Meta tags otimizadas (title, description, keywords)</li>
                <li>Open Graph para redes sociais</li>
                <li>Schema.org markup para rich snippets</li>
                <li>Heading hierarchy (H1, H2, H3)</li>
                <li>Densidade de palavras-chave otimizada</li>
                <li>Links internos e externos relevantes</li>
                <li>Alt text para imagens</li>
                <li>FAQ schema para buscadores de IA</li>
                <li>Conteúdo com mínimo de 2100 palavras</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
