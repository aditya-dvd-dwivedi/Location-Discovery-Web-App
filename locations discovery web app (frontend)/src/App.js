import React, { useCallback,useState } from 'react';

import { BrowserRouter as Router, Route , Redirect , Switch } from 'react-router-dom/cjs/react-router-dom.min';

import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlaces';

import MainNavigation from './shared/components/Navigation/MainNavigation';

import UserPlaces from './places/pages/UserPlaces';

import UpdatePlace from './places/pages/UpdatePlace';

import Auth from './users/pages/Auth';

import { AuthContext } from './shared/context/auth-context';

function App() {

  const [isLoggedIn, setIsLoggedIn]=useState(false);

  const login=useCallback(()=>{
    setIsLoggedIn(true);
  }, []);

  const logout=useCallback(()=>{
    setIsLoggedIn(false);
  }, []);

  //this is to distinguish between logged in sites and non logged in sites
  let routes;

  if(isLoggedIn){
    routes=(
        <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path ="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path = "/places/new" exact>
          <NewPlace/>
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace/>
        </Route>
        <Redirect to ="/"/>
      </Switch>
    );
  }else{//non logged in scene
    routes=(
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path ="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path ="/auth">
          <Auth/>
        </Route>
        <Redirect to ="/auth"/>
      </Switch>
    );
  }

  return(
    <AuthContext.Provider
      value={{isLoggedIn: isLoggedIn, login: login,logout: logout}}
    >
    <Router>

      <MainNavigation/>

      {/*works same as C's switch */}
      <main>
        {routes}
      </main>

    </Router>
  </AuthContext.Provider>)
}

export default App;
