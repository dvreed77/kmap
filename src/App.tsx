import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Header } from "./components/Header";

import { Page1 } from "./routes/page1";
// import { Page2 } from "./routes/page2";

function App() {
  return (
    <Router>
      <Header />
      <div className="w-10/12 mx-auto flex flex-row">
        <Switch>
          <Route path="/page1" component={Page1} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
