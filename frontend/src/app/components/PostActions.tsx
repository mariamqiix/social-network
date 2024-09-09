import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentAlt, faShare } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';


const PostActions = ({ likes }) => {
  return (
    <div className="mt-4 d-flex justify-content-between align-items-center text-muted">
      {/* Show the number of likes */}
      {/* <div>
        <span>
          <FontAwesomeIcon icon={faThumbsUp} /> {likes}
        </span>
      </div> */}
      
      {/* Action buttons with icons */}
      <div>
        <button className="btn btn-outline-primary btn-sm me-2">
          <FontAwesomeIcon icon={faThumbsUp} /> Like
        </button>
        <button className="btn btn-outline-success btn-sm me-2">
          <FontAwesomeIcon icon={faCommentAlt} /> Comment
        </button>
        <button className="btn btn-outline-secondary btn-sm">
          <FontAwesomeIcon icon={faShare} /> Share
        </button>
      </div>
    </div>
  );
};

export default PostActions;