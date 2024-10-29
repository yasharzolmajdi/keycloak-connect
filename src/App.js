import logo from "./logo.svg";
import "./App.css";
import Keycloak from "keycloak-js";
import { useEffect, useState } from "react";

function App() {
  const [keycloakInstance, setKeycloakInstance] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(() => {
    (async () => {
      const keycloak = new Keycloak({
        url: "https://dev.id.q-ctrl.com/auth",
        realm: "q-ctrl",
        clientId: "black-opal-website", //"black-opal-web-client",
      });

      setKeycloakInstance(keycloak);

      try {
        const authenticated = await keycloak.init({ onLoad: "login-required" });
        console.log(
          `User is ${authenticated ? "authenticated" : "not authenticated"}`
        );
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Failed to initialize adapter:", error);
      }
    })();
  }, []);

  return (
    <div className="App">
      {isAuthenticated === false && (
        <>
          <div>
            <button
              onClick={() => {
                keycloakInstance.login();
              }}
            >
              Login
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                keycloakInstance.register();
              }}
            >
              Register
            </button>
          </div>
        </>
      )}
      {isAuthenticated === true && (
        <>
          <pre>{JSON.stringify(keycloakInstance.userInfo, null, 2)}</pre>
          <div>
            <button
              onClick={() => {
                keycloakInstance.login({ action: "CONFIGURE_TOTP" });
              }}
            >
              Setup OTP
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                keycloakInstance.logout();
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
