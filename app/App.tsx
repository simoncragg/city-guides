import Chat from "./components/Chat";
import Logo from "./components/Logo";

function App() {

  return (
    <main className="flex flex-col px-2 min-h-screen bg-white">
      <Logo customClasses="flex-1 justify-center" />
      <div className="flex-1 w-full max-w-screen-lg mx-auto">
        <Chat />
      </div>
    </main>
  )
}

export default App;
