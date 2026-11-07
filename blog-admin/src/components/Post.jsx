import { useState, useRef, useEffect } from "react"
import Comment from './Comment'
import { unauthorizedAlert, badRequestAlert, serverErrorAlert, forbiddenAlert, notFoundAlert, handleAlert, sessionExpiredAlert } from "../assets/sweetalert"
import { useNavigate } from "react-router-dom";

export default function Post(props) {

    const [areCommentsOpen, setAreCommentsOpen] = useState(false);
    const [commentsData, setCommentsData] = useState([]);

    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    function handleCommentClick(){
        setAreCommentsOpen( prev => !prev);
    }

    function handleAddComment(){
        props.add_comment_func(props.id);
    }

    function showUpdateDate(props){
        var published = null;
        var updated = null;
        var created = props.date_created;
        if (props.date_published){
            published = props.date_published;
        }
        //console.log(props.date_published, props.date_updated, props.date_published <= props.date_updated)
        if (props.date_published && props.date_updated && props.date_published <= props.date_updated){
            updated = props.date_updated;
        }

        var isAdmin = true;
        if (!isAdmin){
            created = null;
        }

        return <div className="post-right-column grey-text">
                { created != null ? <p>Date created: {cleanDates(created)} </p> : ''}
                { published != null ? <p>Date published: {cleanDates(published)}</p> : ''}
                { updated != null ? <p>Last updated: {cleanDates(updated)}</p> : ''}
                </div>
    }

    useEffect(() => {
        if (isDeleting) return;
        
        fetch("http://localhost:3000/posts/" + props.id, {
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
                    console.log("REQUEST OK: loaded comments.")
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
                setCommentsData(data.comments)
            }
        })
        .catch(error => {
            console.log("error2")
        })
    }, [areCommentsOpen, props.refreshSwitch]);

    let comments = commentsData.map((c) => {
        return <Comment
            key = {c.comment_id}
            id = {c.comment_id}
            username = {c.username}
            user_id = {c.user_id}
            content = {c.content}
            date = {c.date_posted}
            setRefreshSwitch = {props.setRefreshSwitch}
            postId = {props.id}
            action = {props.action}
        />
    })

    function publishPostHandler(){
        console.log("published");

        function publishFunc(){
            fetch("http://localhost:3000/posts/" + props.id + "/publish", {
                method: "PUT",
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
                        console.log("REQUEST OK: post published.")
                        props.setRefreshSwitch((prev) => !prev);
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
        handleAlert("Do you want to publish this post?","",0,"Cancel","Publish", publishFunc);
    }

    function editPostHandler(){
        navigate("/post/" + props.id);
    }

    function deletePostHandler(){
        console.log("deleted");

        function deleteFunc(){
            fetch("http://localhost:3000/posts/" + props.id, {
                method: "DELETE",
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
                        console.log("REQUEST OK: post deleted.")
                        props.setRefreshSwitch((prev) => !prev);
                        setIsDeleting(true);
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
        handleAlert("Do you want to delete this post?","",2,"Cancel","Delete", deleteFunc);
    }

    function cleanDates(date){
        var newDate = date.split("T")[0] //+ " " + date.split("T")[1].split(".")[0]
        return newDate;
    }

    return (
        <div className="post-container">
            <div className="post-title-container post-columns">
                <div className="post-left-column">
                    { props.date_published ? '' : (
                        <>
                            <i className="fa-solid fa-lock"></i>
                            {'[UNPUBLISHED] '}
                        </>
                    )}
                    {props.title}
                </div>
                <div className="post-right-column margin-left">
                    { props.action == 1 ?
                        <div className="post-editor">
                            {   props.date_published == null ? 
                                <button type="button" className="publish-post tooltip-container"
                                    onClick={publishPostHandler}
                                >
                                    <i className="fa-solid fa-upload"></i>
                                    <span className="tooltip-text">Publish Post</span>
                                </button>
                                : ''
                            }
                            <button type="button" className="edit-post tooltip-container"
                                onClick={editPostHandler}>
                                <i className="fa-solid fa-pen"></i>
                                <span className="tooltip-text">Edit Post</span>
                            </button>
                            <button type="button" className="delete-post tooltip-container"
                                onClick={deletePostHandler}>
                                <i className="fa-solid fa-trash"></i>
                                <span className="tooltip-text">Delete Post</span>
                            </button>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
            <div className="post-content-container">
                <p className="post-content-block">{props.content}</p>
                <div className="post-columns">
                    <div className="post-left-column">
                        { areCommentsOpen ? 
                        <button type="button" className="btn-class primary-button close-comments" onClick={handleCommentClick}>Close Comments</button>
                        : 
                        <button type="button" className="btn-class primary-button open-comments" onClick={handleCommentClick}>Open Comments ({props.comment_count})</button>
                        }
                        <button type="button" className="btn-class add-comment" onClick={handleAddComment}><i className="fa-solid fa-plus"></i> Add Comment</button>
                    </div>
                    {showUpdateDate(props)}
                </div>
            </div>
            { areCommentsOpen ? 
            <div className="comments-container">
                {comments}
            </div> : ''}
        </div>
    )
}