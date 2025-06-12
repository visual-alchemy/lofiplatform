import { StreamDashboard } from "@/components/stream-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-purple-600">Lo-Fi Stream Control</h1>
          <p className="text-gray-600">Manage your 24/7 YouTube Lo-Fi stream</p>
        </header>

        <StreamDashboard />
      </div>
    </main>
  )
}
