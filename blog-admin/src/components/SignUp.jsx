import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { unauthorizedAlert, badRequestAlert, serverErrorAlert, forbiddenAlert, notFoundAlert, handleAlert, sessionExpiredAlert } from "../assets/sweetalert"

export default function SignUp() {

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const usernameInputRef = useRef(null);
    const passwordConfConfInputRef = useRef(null);

    const navigate = useNavigate();

    const [inputData, setInputData] = useState({
        email: "",
        password: "",
        username: "",
        passwordConf: ""
    });

    const [inputValidation, setInputValidation] = useState({
        email: "",
        password: "",
        username: "",
        passwordConf: ""
    });

    async function handleSubmit(formData){

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        const passwordRegex = /^[a-zA-Z0-9]{8,20}$/;

        const emailRule = "Enter a valid email."
        const usernameRule = "Your username can include numbers, lowercase and uppercase letters, and be between 3 and 20 characters long."
        const passwordRule = "Your password can include numbers, lowercase and uppercase letters, and be between 8 and 20 characters long."
        const passwordConfRule = "Your password confirmation does not match."

        const data = Object.fromEntries(formData)

        // DATA TO BE SENT
        const email = data.email.trim();
        const username = data.username.trim();
        const password = data.password;
        const passwordConf = data.passwordConf;
        console.log(data);
        
        // HANDLING DATA

        let emailMsg = "";
        let usernameMsg = "";
        let passwordMsg = "";
        let confirmationMsg = "";
        let error = false;

        if (!emailRegex.test(email)){
            emailMsg = emailRule;
            error = true;
        }else{
            emailMsg = "";
        }

        if (!usernameRegex.test(username)){
            usernameMsg = usernameRule;
            error = true;
        }else{
            usernameMsg = "";
        }

        if (!passwordRegex.test(password)){
            passwordMsg = passwordRule;
            error = true;
        }else{
            passwordMsg = "";
        }

        if (password != passwordConf){
            confirmationMsg = passwordConfRule;
            error = true;
        }else{
            confirmationMsg = "";
        }

        // FETCH
        if (!error){
            console.log("FETCH");
            try{
                const response = await fetch("http://localhost:3000/sign-up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        username: username,
                        password: password
                    })
                });
                const data = await response.json();
                console.log(data);

                switch (response.status) {
                    case 201:
                        navigate("/");
                        break;

                    case 400:
                        console.log("Credenciales invalidas.");
                        if (data.message.includes("username")){
                            usernameMsg = "Existing username.";
                        }else if (data.message.includes("email")){
                            emailMsg = "Existing email."
                        }
                        error = true;
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
                username: usernameMsg,
                password: passwordMsg,
                passwordConf: confirmationMsg
            })
        }
    }

    function handleInputs(){
        let email = emailInputRef.current.value;
        let password = passwordInputRef.current.value;
        let username = usernameInputRef.current.value;
        let passwordConf = passwordConfConfInputRef.current.value;

        setInputData({
            email: email,
            username: username,
            password: password,
            passwordConf: passwordConf
        });
    }

    return (
        <div id="app-container" className="sign-in-container">
            <div id="header">Blogger Client</div>
            <div id="content">
                <div id="login-content">
                    <h1 className="title">Sign In</h1>
                    <form action={handleSubmit} method="post">
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
                                <label htmlFor="username" className="input-labels">Username</label>
                            </div>
                            <input id="username" type="text" name="username" className="login-input input" 
                                onChange={handleInputs}
                                value={inputData["username"]}
                                ref={usernameInputRef}
                                />
                            <p className="form-error">{ inputValidation["username"] != '' ? inputValidation["username"] : ''}</p>

                            <div className="input-label-container">
                                <label htmlFor="password" className="input-labels">Password</label>
                            </div>
                            <input id="password" type="password" name="password" className="login-input input"
                                onChange={handleInputs}
                                value={inputData["password"]}
                                ref={passwordInputRef}
                                />
                            <p className="form-error">{ inputValidation["password"] != '' ? inputValidation["password"] : ''}</p>

                            <div className="input-label-container">
                                <label htmlFor="passwordConf" className="input-labels">Password Confirmation</label>
                            </div>
                            <input id="passwordConf" type="password" name="passwordConf" className="login-input input"
                                onChange={handleInputs}
                                value={inputData["passwordConf"]}
                                ref={passwordConfConfInputRef}
                                />
                            <p className="form-error">{ inputValidation["passwordConf"] != '' ? inputValidation["passwordConf"] : ''}</p>
                            
                        </div>
                        <br />
                        <div id="sign-up-button-container">
                            <button id="sign-up-button" className="btn-class primary-button">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}