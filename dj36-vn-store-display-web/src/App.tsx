import Display from "./components/display/Display";
import { WebSocketProvider } from "./context/WebSocketContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
    <WebSocketProvider>
      <Routes>
        <Route path="/" element={<Display />} />
      </Routes>
    </WebSocketProvider>
  </Router>
  );
}

export default App;
