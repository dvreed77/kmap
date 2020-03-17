import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Canvas from "./canvas";
import { Modal, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";

import Page1 from "./routes/page1";
import { Page2 } from "./routes/page2";

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Modal
        title="Kmap"
        visible={modalVisible}
        footer={null}
        closable={false}
        // onOk={this.handleOk}
        onCancel={() => setModalVisible(false)}
      ></Modal>
      <div className="text-xl p-3 w-10/12 mx-auto flex justify-between">
        <div>
          <a href="http://dvreed.com">dvreed.com</a>
        </div>
        <div className="flex">
          <div
            className="hover:text-orange-400 cursor-pointer"
            onClick={() => setModalVisible(true)}
          >
            About
          </div>
          <div className="hover:text-orange-400 cursor-pointer">
            <a
              className="hover:text-orange-400 cursor-pointer pl-3"
              href="https://github.com/dvreed77/kmap"
            >
              <FontAwesomeIcon
                className="hover:text-orange-400 cursor-pointer"
                color="black"
                icon={faGithubSquare}
                size="lg"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [activePt, setActivePt] = useState(null);
  const mouseOver = pt => {
    setActivePt(pt);
  };

  return (
    <Router>
      <Header />
      <div className="w-10/12 mx-auto flex flex-row">
        <Switch>
          <Route path="/page1" component={Page1} />
          <Route path="/page2" component={Page2} />
          <Route path="/">
            <Canvas mouseOver={mouseOver} />
            {activePt && (
              <ul>
                <li>ANT: {activePt.ant}</li>
                <li>BAT: {activePt.bat}</li>
                <li>CAT: {activePt.cat}</li>
                <li>DOG: {activePt.dog}</li>
              </ul>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
