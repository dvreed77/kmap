import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";

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
  return (
    <Router>
      <Header />
      <div className="w-10/12 mx-auto flex flex-row">
        <Switch>
          <Route path="/" component={Page2} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
