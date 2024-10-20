import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faShare } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import "./buttons.css";

const PostActions = ({ likes, id }) => {
  function likePost() {
    fetch("http://localhost:8080/post/addReaction/", { method: "POST", credentials: 'include', body: JSON.stringify({ post_id: id, reaction: "Like" }) }).then((res) => {
      res.text().then((data) => {
        console.log(data);
        // setPost(data);
      });
    });
  }

  return (
    <div className="d-flex justify-content-between align-items-center text-secondary">
      {/* Show the number of likes */}
      {/* <div>
        <span>
          <FontAwesomeIcon icon={faThumbsUp} /> {likes}
        </span>
      </div> */}

      {/* Action buttons with icons */}
      <div>
        <button className="btn btn-outline-primary border-0 btn-sm me-2" onClick={likePost}>
          <FontAwesomeIcon icon={faThumbsUp} /> {likes} {likes == 1 ? "Like" : "Likes"}
        </button>
        <button className="btn btn-outline-purple border-0 btn-sm me-2">
          <FontAwesomeIcon icon={faCommentAlt} /> Comment
        </button>
        <button className="btn btn-outline-secondary border-0 btn-sm">
          <FontAwesomeIcon icon={faShare} /> Share
        </button>
      </div>
    </div>
  );
};

export default PostActions;