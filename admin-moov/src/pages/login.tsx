import React from "react";
import './login.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const LoginForm: React.FC = () => {
  return (
    
    <form className="form" action="/home">
      <div className="img">
          <img src="../logo.png" alt="" />

      </div>
      <div className="flex-column">
        <label>Téléphone </label>
      </div>
      <div className="inputForm">
        {/* <svg
          height="20"
          viewBox="0 0 32 32"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Layer_3" data-name="Layer 3">
            <path
              d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"
            ></path>
          </g>
        </svg> */}
        <i className="bi bi-telephone"></i>

        <input type="number" className="input" placeholder="numéro de téléphone" />
      </div>

      <div className="flex-column">
        <label>Mot de passe </label>
      </div>
      <div className="inputForm">
        {/* <svg
          height="20"
          viewBox="-64 0 512 512"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"
          ></path>
          <path
            d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"
          ></path>
        </svg> */}
        <i className="bi bi-key"></i>
        <input
          type="password"
          className="input"
          placeholder="mot e passe "
        />
      </div>

      <div className="flex-row">
        <div>
          <input type="radio" />
          <label>Se souvenir de moi </label>
        </div>
        <span className="span"><a href="/mdp">Forgot password?</a></span>
      </div>
      <button className="button-submit">Se connecter</button>
      <p className="p">
        Vous n'avez pas de compte? <span className="span"><a href="/inscription">S'inscrire</a></span>
      </p>
      {/* <p className="p line">Or With</p> */}

      {/* <div className="flex-row">
        <button className="btn google">
          <svg
            version="1.1"
            width="20"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
          >
            <path
              style={{ fill: "#FBBB00" }}
              d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256 c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456 C103.821,274.792,107.225,292.797,113.47,309.408z"
            ></path>
            <path
              style={{ fill: "#518EF8" }}
              d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451 c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535 c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
            ></path>
            <path
              style={{ fill: "#28B446" }}
              d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512 c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771 c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
            ></path>
            <path
              style={{ fill: "#F14336" }}
              d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012 c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0 C318.115,0,375.068,22.126,419.404,58.936z"
            ></path>
          </svg>
          Google
        </button>
        <button className="btn apple">
          <svg
            version="1.1"
            height="20"
            width="20"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 22.773 22.773"
            xmlSpace="preserve"
          >
            <g>
              <g>
                <path
                  d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"
                ></path>
                <path
                  d="M19.511,15.243c-0.649,1.524-1.428,2.928-2.609,4.101c-0.853,0.867-1.937,1.854-3.347,1.854 c-1.423,0-1.796-0.926-3.353-0.926c-1.574,0-2.033,0.895-3.349,0.949c-1.456,0.053-2.591-1.69-3.441-3.558 c-1.88-4.109-0.207-9.378,1.35-12.467c0.928-1.686,2.109-2.835,3.515-2.835c1.379,0,2.188,0.943,3.352,0.943 c1.135,0,1.826-0.944,3.549-0.944c1.266,0,2.196,0.659,2.841,1.364c-2.492,1.345-2.083,4.836,0.395,5.749 C19.279,11.533,20.305,13.734,19.511,15.243z"
                ></path>
                <path
                  d="M14.863,22.773c1.336-1.618,1.916-3.088,2.175-3.657c-2.097,0.352-3.895-1.215-4.227-1.504 C11.833,19.287,11.308,20.665,14.863,22.773z"
                ></path>
              </g>
            </g>
          </svg>
          Apple
        </button>
      </div> */}
    </form>
  );
};

export default LoginForm;
