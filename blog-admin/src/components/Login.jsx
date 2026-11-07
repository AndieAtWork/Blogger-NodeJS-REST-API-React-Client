import { useState, useRef, useEffect } from "react"
import { unauthorizedAlert, badRequestAlert, serverErrorAlert, forbiddenAlert, handleAlert } from "../assets/sweetalert"
import { useNavigate } from "react-router-dom";

export default function Login() {

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const navigate = useNavigate();

    const [inputData, setInputData] = useState({
        email: "",
        password: ""
    });

    const [inputValidation, setInputValidation] = useState({
        email: "",
        password: ""
    });

    async function handleSubmit(formData){
        const data = Object.fromEntries(formData)

        // DATA TO BE SENT
        const email = data.email.trim();
        const password = data.password;
        console.log(data);
        
        // HANDLING DATA

        let emailMsg = "";
        let passwordMsg = "";
        let error = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length < 1 || !emailRegex.test(email)){
            emailMsg = "Enter a valid email."
            error = true;
        }else{
            emailMsg = "";
        }

        if (password.length < 1){
            passwordMsg = "Enter a password."
            error = true;
        }else{
            passwordMsg = "";
        }

        // FETCH
        if (!error){
            console.log("FETCH");
            try{
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                const data = await response.json();
                console.log(data);

                switch (response.status) {
                    case 200:
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("admin", data.adminVisualization ? 1 : 0);
                        localStorage.setItem("user_id", data.user_id);
                        //console.log("ADMIN", localStorage.getItem("admin"))
                        navigate("/blog");
                        break;
                    case 401:
                        console.log("Credenciales incorrectas.");
                        emailMsg = "";
                        passwordMsg = "Incorrect credentials.";
                        error = true;
                        //unauthorizedAlert();
                        break;
                    case 500:
                        serverErrorAlert();
                        error = true;
                        break;
                }

            }catch(error){
                console.log("ERROR EN CONEXION", error);
            }
        }

        // ERROR
        if (error){
            setInputValidation({
                email: emailMsg,
                password: passwordMsg
            })
        }
    }

    function handleInputs(){
        let email = emailInputRef.current.value;
        let password = passwordInputRef.current.value;
        setInputData({
            email: email,
            password: password
        });
    }

    function createNewAccount(){
        navigate("/sign_up");
    }

    return (
        <div id="app-container" className="login-container">
            <div id="header">Blogger Client</div>
            <div id="content">
                <div id="login-content">
                    <h1 className="title">Login</h1>
                    <form action={handleSubmit}>
                        <div>
                            <div className="input-label-container">
                                <label htmlFor="email" className="input-labels">Email</label>
                            </div>
                            <input id="email" type="text" name="email" className="login-input input" 
                                onChange={handleInputs} 
                                value={inputData["email"]}
                                ref={emailInputRef}
                            />
                            <p className="form-error">{ inputValidation["email"] != '' ? inputValidation["email"] : ''}</p>
                            
                            <div className="input-label-container">
                                <label htmlFor="password" className="input-labels">Password</label>
                            </div>
                            <input id="password" type="password" name="password" className="login-input input"
                                ref={passwordInputRef}
                            />
                            <p className="form-error">{ inputValidation["password"] != '' ? inputValidation["password"] : ''}</p>
                        </div>
                        <br />
                        <div id="login-submit-button-container">
                            <button type="submit" id="login-submit-button" className="btn-class primary-button">Enter</button>
                        </div>
                    </form>
                    <div>
                        <p id="sign-up-link" onClick={createNewAccount}>Create new account</p>
                    </div>
                </div>
            </div>
        </div>
    )
}