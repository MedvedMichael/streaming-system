import './App.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from 'pages/LoginPage/LoginPage';
import RegistrationPage from 'pages/RegistrationPage/RegistrationPage';
import ProfilePage from 'pages/ProfilePage/ProfilePage';

function App() {
  return (
    <AppView>
      <Router>
        <MainLayout>
          <Switch>
            <Route path="/" exact component={LoginPage}></Route>
            <Route path="/registration" component={RegistrationPage}></Route>
            <Route path="/users/:id" component={ProfilePage} />
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

  @media (max-width: 50rem) {
    flex-direction: column;
  }
`;

const AppView = styled.div`
  background: #282c34;
  min-width: none;
  height: 100vh;
  color: #fff;
  overflow: hidden;
`;
