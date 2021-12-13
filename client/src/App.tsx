import "./App.css";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "pages/LoginPage/LoginPage";
import RegistrationPage from "pages/RegistrationPage/RegistrationPage";
import ProfilePage from "pages/ProfilePage/ProfilePage";
import StreamPage from "pages/StreamPage/StreamPage";
import "video.js/dist/video-js.css";
import AvailableStreamsPage from "pages/AvailableStreamsPage/AvailableStreamsPage";
import Navbar from "components/navbar/navbar";

function App() {
  return (
    <AppView onKeyPress={() => {
      console.log('PRESS')
    }}>
      <Router>
        <MainLayout>
          <Navbar/>
          <Switch>
            <Route path="/" exact component={LoginPage}></Route>
            <Route path="/registration" component={RegistrationPage}></Route>
            <Route path="/users/:id" component={ProfilePage} />
            <Route path="/stream/:streamKey" component={StreamPage}></Route>
            <Route path="/streams" component={AvailableStreamsPage}></Route>
          </Switch>
        </MainLayout>
      </Router>
    </AppView>
  );
}

export default App;

const MainLayout = styled.div`
  display: flex;
  height: 100vh;

  /* @media (max-width: 50rem) {
    flex-direction: column;
  } */
`;

const AppView = styled.div`
  height: 100vh;
  color: #fff;
`;
