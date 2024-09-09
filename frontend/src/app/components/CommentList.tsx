import Comment from './Comment';
import { randomColor } from "../components/colors"; 

const CommentList = ({ comments }) => {
  return (
    <div className="mt-4">
      <h5 className="mb-4">Comments</h5>
      {comments.map((comment, index) => (
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
      ))}
    </div>
  );
};

export default CommentList;


