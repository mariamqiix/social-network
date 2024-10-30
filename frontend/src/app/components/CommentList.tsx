import Comment from './Comment';
import { randomColor } from "../components/colors";
import "./buttons.css";

const CommentList = ({ comments, addComment }) => {
  return (
    <div className="mt-4">
      <h5 className="mb-4">Comments</h5>
      <form onSubmit={(e) => {
        e.preventDefault();
        let data = new FormData(e.target as HTMLFormElement);
        addComment(data.get("content"));
        e.target.reset();
      }}>
        <textarea className="w-10rea0 form-control" name="content"></textarea>
        <button type='submit' className='btn btn-outline-purple border-0'>Add Comment</button>
      </form>
      <br />
      {comments != null ?

        comments.map((comment, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body" style={{
              backgroundColor: randomColor(), // Set the background color to a random color
            }}>
              <Comment
                author={comment.author}
                content={comment.content}
                time={comment.time}
                likes={comment.likes}
              />
            </div>
          </div>
        ))
        : <p>No comments</p>}
    </div>
  );
};

export default CommentList;


