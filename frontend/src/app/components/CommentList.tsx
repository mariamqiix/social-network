
// const CommentList = ({ comments }) => {
//   return (
//     <div className="card">
//       <div className="card-body">
//         <h5 className="card-title">Comments</h5>
//         {comments.map((comment, index) => (
//           <div key={index} className="mb-3">
//             <div className="d-flex align-items-start">
//               <img
//                 src={"placeholder.jpg"}
//                 alt={comment.author.name}
//                 width={40}
//                 height={40}
//                 className="rounded-circle me-2"
//               />
//               <div>
//                 <h6 className="mb-0">{comment.author.name}</h6>
//                 <small className="text-muted">{comment.time}</small>
//                 <p className="mt-1 mb-0">{comment.content}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommentList;
import Comment from './Comment';

const CommentList = ({ comments }) => {
  return (
    <div className="mt-4">
      <h5 className="mb-4">Comments</h5>
      {comments.map((comment, index) => (
        <div key={index} className="card mb-3">
          <div className="card-body">
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


