import Chat from "./components/Chat";
import Logo from "./components/Logo";

function App() {

  return (
    <main className="flex flex-col min-h-screen bg-white px-2 py-8">
      <Logo customClasses="flex-1 justify-center" />
      <div className="flex-1 w-full max-w-screen-lg mx-auto">
        <Chat />
      </div>
    </main>
  )
}

export default App;
