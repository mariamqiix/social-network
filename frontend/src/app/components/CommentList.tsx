import Comment from './Comment';

const CommentList = ({ comments }) => {
  return (
    <div className="card-comments">
       <div className="comment">
          {/* <div className="mt-6"> */}
          <div className="comment-card-right">
            <div className="user-comment">
            {/* <h2 className="text-l font-semibold mb-4">Comments</h2> */}
              {comments.map((comment, index) => (
              <Comment 
              key={index}
              author={comment.author}
              content={comment.content}
              time={comment.time}
              // likes={comment.likes}
           />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentList;
