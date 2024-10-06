import React, { useState } from "react";
import QuizCRUD from "./components/CRUDComponent.js";
import Login from "./components/Login.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? <QuizCRUD /> : <Login setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
}

export default App;
