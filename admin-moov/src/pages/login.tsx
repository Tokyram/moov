/* eslint-disable react/style-prop-object */
import React, { useState } from "react";
import './login.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import API_BASE_URL from '../domaine';  // Importation de l'URL de base
import axios from 'axios';
import { useNavigate } from "react-router-dom";  // Utiliser useNavigate
import { ToastContainer } from "react-toastify";

const LoginForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();  // Utiliser useNavigate pour naviguer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        username: phoneNumber,
        password: password
      });

      const data = response.data;

      if (response.status !== 200) {
        setErrorMessage(data.message || "Erreur lors de la connexion");
      } else {
        // Vérifiez si le rôle est ADMIN
        if (data.user.role !== 'ADMIN') {
          setErrorMessage("Vous n'avez pas les droits d'accès.");
        } else {
          console.log("Connexion réussie", data);
          
          // Stocker le token localement
          localStorage.setItem('token', data.token);  // Utiliser localStorage

          navigate("/home");  // Utiliser navigate pour rediriger
        }
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);

      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Numéro ou mot de passe incorrect.");
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    // <div className="login">

    //   <ToastContainer
    //     position="top-right"
    //     autoClose={50000}
    //     hideProgressBar={false}
    //     newestOnTop={false}
    //     closeOnClick
    //     rtl={false}
    //     pauseOnFocusLoss
    //     draggable
    //     pauseOnHover
    //   />
      
    //   <form className="form" onSubmit={handleSubmit}>
    //     <div className="img">
    //       <img src="../logo.png" alt="logo" />
    //     </div>

    //     <div className="flex-column">
    //       <label>Téléphone </label>
    //     </div>
    //     <div className="inputForm">
    //       <i className="bi bi-telephone"></i>
    //       <input
    //         type="text"
    //         className="input"
    //         placeholder="numéro de téléphone"
    //         value={phoneNumber}
    //         onChange={(e) => setPhoneNumber(e.target.value)} 
    //       />
    //     </div>

    //     <div className="flex-column">
    //       <label>Mot de passe </label>
    //     </div>
    //     <div className="inputForm">
    //       <i className="bi bi-key"></i>
    //       <input
    //         type="password"
    //         className="input"
    //         placeholder="mot de passe"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </div>

    //     <div className="flex-row">
    //       {/* <div>
    //         <input type="radio" />
    //         <label>Se souvenir de moi </label>
    //       </div> */}
    //       <span className="span"><a href="/mdp">Forgot password?</a></span>
    //     </div>

    //     <button type="submit" className="button-submit">Se connecter</button>

    //     {errorMessage && <div className="error-message">{errorMessage}</div>}
    //   </form>
      
    // </div>
    <section className="vh-100" >
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-10">
                <div className="card" >
                  <div className="row g-0">
                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                      <img src="../p11.png"alt="login form" className="img-fluid" style={{ bottom: '0', width: '55%', height: 'auto', objectFit: 'cover' , position: 'absolute'}}/>
                    </div>
                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">

                        <form onSubmit={handleSubmit}>

                          <div className="d-flex align-items-center mb-3 pb-1">
                            {/* <i className="fas fa-cubes fa-2x me-3"></i> */}
                            <div className="img" style={{width: '100%', }}>
                                  <img style={{width: '50%', imageOrientation: 'horizontal' }} src="../admin.png" alt="logo" />
                            </div>
                            {/* <span className="h1 fw-bold mb-0">Logo</span> */}
                          </div>

                          {/* <h5 className="fw-normal mb-3 pb-3" >Connecter a votre compte</h5> */}

                          <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example17">Numero Téléphone</label>

                            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}  id="form2Example17" className="form-control form-control-lg" placeholder="+261 ** ** *** **" style={{borderRadius: '50px'}}/>
                          </div>

                          <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example27">Mot de passe</label>

                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="form2Example27" className="form-control form-control-lg" placeholder="***************" style={{borderRadius: '50px'}}/>
                          </div>

                          {errorMessage && <div className="error-message">{errorMessage}</div>}

                          <div className="pt-1 mb-4">
                            <button data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-lg btn-block" type="submit" style={{borderRadius: '50px'}}>Se connecter</button>
                          </div>

                          <a style={{color: 'var(--primary-color) !important', textDecoration: 'none'}} className="small text-muted" href="#!">Mot de passe oublié?</a> <br />
                          {/* <p className="mb-5 pb-lg-2" >Don't have an account? <a href="#!"
                              >Register here</a></p> */}
                          <a href="#!" className="small text-muted">Terme d'utilisation.</a>
                          {/* <a href="#!" className="small text-muted">Privacy policy</a> */}
                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
};

export default LoginForm;
