import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { unauthorizedAlert, badRequestAlert, serverErrorAlert, forbiddenAlert, notFoundAlert, handleAlert, sessionExpiredAlert } from "../assets/sweetalert"

export default function Edit() {

    const titleInputRef = useRef(null);
    const contentInputRef = useRef(null);

    const buttonRef = useRef(null);

    const { postId } = useParams();
    const navigate = useNavigate();

    const [inputData, setInputData] = useState({
        title: "",
        content: ""
    });

    const [inputValidation, setInputValidation] = useState({
        title: "",
        content: ""
    });

    async function handleSubmit(formData){
        const data = Object.fromEntries(formData)

        // DATA TO BE SENT
        const title = data.title;
        const content = data.postContent;
        console.log(data);

        // HANDLING DAT
        let titleMsg = "";
        let contentMsg = "";
        let error = false;

        let titleRules = "Your title must be between 1 to 100 characters long";
        let contentRules = "Your content must be between 1 to 5000 characters long";

        const titleRegex = /^.{1,100}$/s;
        const contentRegex = /^.{1,5000}$/s;

        if (title.trim().length == 0 || !titleRegex.test(title)){
            titleMsg = titleRules;
            error = true;
        }

        if (content.trim().length == 0 || !contentRegex.test(content)){
            contentMsg = contentRules;
            error = true;
        }

        // FETCH
        if (!error){
            console.log("FETCH");
            if (parseInt(postId) == 0){
                fetch("http://localhost:3000/posts/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                })
                .then(response => {
                    console.log("repsonse", response.status)
                    switch (response.status) {
                        case 400:
                            badRequestAlert();
                            break;
                        case 403:
                            forbiddenAlert();
                            break;
                        case 201:
                            console.log("REQUEST OK: new post created")
                            navigate("/");
                            break;
                        case 500:
                            serverErrorAlert();
                            break;
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    if (data.message == "Expired"){
                        localStorage.removeItem("token");
                        localStorage.removeItem("admin");
                        localStorage.removeItem("user_id");
                        sessionExpiredAlert();
                        return;
                    }
                })
                .catch(error => {
                    console.log("error2")
                })
            }else{
                fetch("http://localhost:3000/posts/" + postId, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token")
                    },
                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                })
                .then(response => {
                    console.log("repsonse", response.status)
                    switch (response.status) {
                        case 400:
                            badRequestAlert();
                            break;
                        case 404:
                            notFoundAlert();
                            break;
                        case 403:
                            forbiddenAlert();
                            break;
                        case 200:
                            console.log("REQUEST OK: post updated.")
                            navigate("/");
                            break;
                        case 500:
                            serverErrorAlert();
                            break;
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    if (data.message == "Expired"){
                        localStorage.removeItem("token");
                        localStorage.removeItem("admin");
                        localStorage.removeItem("user_id");
                        sessionExpiredAlert();
                        return;
                    }
                })
                .catch(error => {
                    console.log("error2")
                })
            }
            navigate("posts/blog");
        }

        // ERROR
        if (error){
            setInputValidation({
                title: titleMsg,
                content: contentMsg
            })
        }
    }

    function handleInputs(){
        let title = titleInputRef.current.value;
        let content = contentInputRef.current.value;
        setInputData({
            title: title,
            content: content
        });
    }

    useEffect(() => {

        if (parseInt(postId) == 0){
            console.log("new post");
            buttonRef.current.innerHTML = "Create Post";
        }else{
            console.log("editing " + String(postId));
            buttonRef.current.innerHTML = "Update Post";
            fetch("http://localhost:3000/posts/" + postId, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(response => {
                console.log("repsonse", response.status)
                switch (response.status) {
                    case 404:
                        notFoundAlert();
                        break;
                    case 403:
                        forbiddenAlert();
                        break;
                    case 200:
                        console.log("REQUEST OK: post loaded");
                        break;
                    case 500:
                        serverErrorAlert();
                        break;
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.message == "Expired"){
                    localStorage.removeItem("token");
                    localStorage.removeItem("admin");
                    localStorage.removeItem("user_id");
                    sessionExpiredAlert();
                    return;
                }else{
                    setInputData({
                        title: data["post"]["title"],
                        content: data["post"]["content"]
                    })
                }
            })
            .catch(error => {
                console.log("error2", error)
            })
        }
    }, []);

    return (
        <main>
            <div id="app-container" className="blog-container">
                <div id="header">Blogger Client</div>
                <div id="content">
                    <div id="edit-content">
                        <h3 className="title">Post Management</h3>
                        <div id="posts-container">
                            <form action={handleSubmit}>
                                <div>
                                    <div className="input-label-container">
                                        <label htmlFor="title" className="input-labels">Title</label>
                                    </div>
                                    <input id="title" type="text" name="title" className="input edit-title-input"
                                        onChange={handleInputs}
                                        value={inputData["title"]} 
                                        ref={titleInputRef}
                                    />
                                    <p className="char-counter">Characters: 
                                        <span className="post-char-counter">
                                            {inputData["title"].length} / 100
                                        </span>
                                    </p>
                                    <p className="form-error">{inputValidation["title"]}</p>

                                    <div className="input-label-container">
                                        <label htmlFor="postContent" className="input-labels">Content</label>
                                    </div>
                                    <textarea id="postContent" name="postContent" className="post-content-input input" 
                                        onChange={handleInputs}
                                        value={inputData["content"]}
                                        ref={contentInputRef}
                                    ></textarea>
                                    <p className="char-counter">Characters: 
                                        <span className="post-char-counter">
                                        {inputData["content"].length} / 5000
                                        </span>
                                    </p>
                                    <p className="form-error">{inputValidation["content"]}</p>
                                </div>
                                <br />
                                <div id="submit-button-container">
                                    <button type="submit" id="submit-content-button" className="btn-class primary-button"><i className="fa-solid fa-plus"></i>
                                     <span ref={buttonRef}>Create Post</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}