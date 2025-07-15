import Chat from "./components/Chat";

function App() {

  return (
    <main className="flex flex-col min-h-screen bg-white px-2 py-8">

      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={`${import.meta.env.VITE_PUBLIC_URL}/logo-min.png`} className="text-9xl mb-3 md:max-w-[600px]" alt="City Guides" />
        <h1 className="text-4xl font-serif font-bold text-gray-700">City Guides</h1>
      </div>

      <div className="flex-1 w-full max-w-screen-lg mx-auto">
        <Chat />
      </div>
    </main>
  )
}

export default App;
