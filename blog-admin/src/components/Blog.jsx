import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { unauthorizedAlert, badRequestAlert, serverErrorAlert, forbiddenAlert, notFoundAlert, handleAlert, sessionExpiredAlert } from "../assets/sweetalert"
import Post from './Post'

export default function Blog() {

    const [ data, setData ] = useState([])
    const [ refreshSwitch, setRefreshSwitch ] = useState(false)
    
    // When opening the modals, the screen doesn't move
    const dialogRef = useRef(null);
    const scrollPosition = useRef(0);

    // Character counting and reseting comments when closing
    const commentInputRef = useRef(null);
    const counterRef = useRef("0");
    const errorRef = useRef("");

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        localStorage.removeItem("user_id");
        navigate("/");
    }

    const openModal = (idPost) => {
        localStorage.setItem("idPost", idPost);
        errorRef.current.textContent = "";
        scrollPosition.current = window.scrollY;
        dialogRef.current.showModal();
    };
    const closeModal = () => {
        dialogRef.current.close();
        commentInputRef.current.value = '';
        counterRef.current.textContent = '0 / 500';
        requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition.current);
        });
    };

    async function handleCommentSubmission(event){

        // DATA TO BE SENT
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const comment = formData.get("commentContent");
        
        // HANDLING DATA
        const commentRegex = /^.{10,1000}$/;
        let commentMsg = "";
        let error = false;
        const commentRule = "Your comment must be between 10 to 1000 chacarcters long and include text.\nPlease remember to be polite."

        if (!commentRegex.test(comment) || comment.trim().length == 0){
            commentMsg = commentRule;
            error = true;
        }else{
            commentMsg = "";
            error = false;
        }

        if (!error){
            errorRef.current.textContent = ""
            const idPost = localStorage.getItem("idPost");
            console.log("FETCH", idPost)
            fetch("http://localhost:3000/posts/" + idPost +  "/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    content: comment
                })
            })
            .then(response => {
                console.log("repsonse", response.status)
                switch (response.status) {
                    case 404:
                        notFoundAlert();
                        break;
                    case 400:
                        badRequestAlert();
                        break;
                    case 201:
                        console.log("REQUEST OK: Post Comment")
                        setRefreshSwitch((prev) => !prev);
                        closeModal();
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
            return;
        }
        if (error){
            errorRef.current.textContent = commentMsg;
            return;
        }
    }

    function createNewPost(){
        navigate("/post/0");
    }

    function handleComment(event){
        const value = event.target.value;
        const length = value.length;
        counterRef.current.textContent = `${length} / 500`;
    }

    useEffect(() => {
        fetch("http://localhost:3000/posts", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            console.log("repsonse", response.status)
            switch (response.status) {
                case 200:
                    console.log("REQUEST OK: Get posts")
                    break;
                case 500:
                    serverErrorAlert();
                    break;
            }
            return response.json();
        })
        .then(data => {
            if (data.message == "Expired"){
                localStorage.removeItem("token");
                localStorage.removeItem("admin");
                localStorage.removeItem("user_id");
                sessionExpiredAlert();
            }else{
                setData(data);
            }
        })
        .catch(error => {
            console.log("error2")
        })
    }, [refreshSwitch]);


    const entries = data.map((entry) => {
        return <Post
            key = {entry.post_id}
            id = {entry.post_id}
            username = {entry.username}
            title = {entry.title}
            content = {entry.content}
            date_published = {entry.date_published}
            date_updated = {entry.date_updated}
            date_created = {entry.date_created}
            comment_count = {entry.count}
            add_comment_func = {openModal}
            setRefreshSwitch = {setRefreshSwitch}
            refreshSwitch = {refreshSwitch}
            action = {localStorage.getItem("admin")}
        />
    })

    return (
        <main>
            <div id="app-container" className="blog-container">
                <div id="header">Blogger Client</div>
                <div id="content">
                    <div id="blog-content">
                        <div id="log-out-container">
                            <button type="button" className="btn-class primary-button" onClick={logout}>Log Out</button>
                        </div>
                        <h1 className="title">Back from the dead with Starbucks!</h1>
                        <h4 className="title secondary-text">This is Andie´s blog where they try to make React work as they want to. Let's say it's a work in progress.</h4>
                        { localStorage.getItem("admin") == 1 ?
                            <div className="create-post-btn">
                                <button type="button" className="btn-class primary-button" onClick={createNewPost}><i className="fa-solid fa-plus"></i> Create New Post</button>
                            </div>
                            :
                            ''
                        }
                        <div id="posts-container">
                            {entries}
                        </div>
                    </div>
                </div>
            </div>

            <dialog id="add-comment-modal" ref={dialogRef} className="modal">
                <h2 className="title">Add Comment</h2>
                <div id="modal-body">
                    <form onSubmit={handleCommentSubmission}>
                        <div id="modal-content">
                            <div className="input-label-container">
                                <label htmlFor="commentContent" className="input-labels">Content</label>
                            </div>
                            <textarea id="commentContent" name="commentContent" className="comment-content-input input"
                                onChange={handleComment}
                                ref={commentInputRef}
                            ></textarea>
                            <p className="char-counter">Characters: 
                                <span id="comment-char-counter" ref={counterRef}>
                                    0 / 500
                                </span>
                            </p>
                            <p className="form-error" ref={errorRef}></p>
                        </div>
                        <div id="modal-footer">
                            <button type="submit" className="btn-class primary-button btn-footer">
                                <i className="fa-solid fa-plus"></i> Add Comment
                            </button>
                            <button type="button" className="btn-class secondary-button btn-footer" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

        </main>
    )
}