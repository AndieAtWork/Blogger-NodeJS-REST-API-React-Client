import { useState, useRef, useEffect } from "react"
import { unauthorizedAlert, badRequestAlert, serverErrorAlert, forbiddenAlert, notFoundAlert, handleAlert, sessionExpiredAlert } from "../assets/sweetalert"

export default function Comment(props) {

    function cleanDates(date){
        var newDate = date.split("T")[0] //+ " " + date.split("T")[1].split(".")[0]
        return newDate;
    }

    function deleteCommentHandler(){
        function deleteFunc(){
            fetch("http://localhost:3000/posts/" + props.postId + "/comment/" + props.id, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
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
                        console.log("REQUEST OK: comment deleted.")
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
        handleAlert("Do you want to delete this comment?","",2,"Cancel","Delete", deleteFunc);
    }

    return (
        <div className="comment">
            <div className="post-columns">
                <div className="comment-username post-left-column">
                    {props.username}
                </div>
                <div className="post-right-column">
                    { props.action == 1 || props.user_id == localStorage.getItem("user_id") ?
                        <button type="button" className="delete-comment tooltip-container" onClick={deleteCommentHandler}>
                            <i className="fa-solid fa-trash"></i>
                            <span className="tooltip-text">Delete Comment</span>
                        </button> 
                        : ''
                    }
                </div>
            </div>
            <div className="comment-content">
                <p>{props.content}</p>
            </div>
            <div className="comment-footer">
                <p>Comment posted: {cleanDates(props.date)}</p>
            </div>
        </div>
    )
}