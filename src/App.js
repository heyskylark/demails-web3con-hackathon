import "./App.css";
import { ProvideEthersProvider } from "./context/providerContext.js";
import Login from "./pages/Login.js";

function App() {
  return (
    <ProvideEthersProvider>
      <div className="App">
        <Login />
      </div>
    </ProvideEthersProvider>
  );
}

export default App;
