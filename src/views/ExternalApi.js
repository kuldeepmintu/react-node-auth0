import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import config from "../auth_config.json";
import Loading from "../components/Loading";

const { apiOrigin = "http://localhost:3001" } = config;

export const ExternalApiComponent = () => {
  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const handleConsent1 = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi1();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const callApi = async () => {
    try {
      setState({
        ...state,
        showResult: false
      });
      console.log("Hi");
      var token = await getAccessTokenWithPopup();
      console.log(token);
      const response = await fetch(`https://qjmwujos9i.execute-api.us-east-2.amazonaws.com/docs/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("he");

      const responseData = await response.json();
      console.log(responseData);
      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };


  const callApi1 = async () => {
    try {
      setState({
        ...state,
        showResult: false
      });

      console.log("Hi");
      var token = await getAccessTokenWithPopup();
      console.log(token);
      const response = await fetch(`https://bwzs7n5kp0.execute-api.us-east-2.amazonaws.com/v1/getdata`,{ mode: 'no-cors' });
      console.log(response);
      var responseData;
      if(response.ok)
        responseData = await response.json();
      else{
        responseData=Promise.reject(response);
      }
       
      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      var obj = JSON.parse('{"message":"Exception"}');
      console.log(obj);
      setState({
        ...state,
        showResult: true,
        apiMessage: obj,
        error: error.error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <>
      <div className="mb-5">
        {/* {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )} */}

        <h1>External API</h1>
        <p>
          Ping an external API by clicking the button below. This will call the
          external API using an access token, and the API will validate it using
          the API's audience value.
        </p>

        <Button color="primary" className="mt-5" onClick={callApi}>
          Ping API with correct Auth0 provided JWT Authenticator
        </Button>
        <hr/>
        <Button color="primary" className="" onClick={callApi1}>
          Ping API with using Custom Authenticator
        </Button>
      </div>

      <div className="result-block-container">
        {state.showResult && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Result</h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
          </div>
        )}
      </div>
    </>
  );
};

//export default withAuthenticationRequired(ExternalApiComponent, {
//  onRedirecting: () => <Loading />,
//});
export default ExternalApiComponent;
