import "./App.css";
import { ProvideOrbitDb } from "./context/orbtDbContext";
import { ProvideEthersProvider } from "./context/providerContext.js";
import Login from "./pages/Login.js";

function App() {
  return (
    <ProvideEthersProvider>
      <ProvideOrbitDb>
        <div className="App">
          <Login />
        </div>
      </ProvideOrbitDb>
    </ProvideEthersProvider>
  );
}

export default App;
