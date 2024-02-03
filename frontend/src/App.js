
import './App.css';
import Chat from './Pages/Chat';
import Home from './Pages/Home';
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route path='/' component={ Home } exact />
      <Route path='/chats' component={ Chat } exact/>
    </div>
  );
}

export default App;
