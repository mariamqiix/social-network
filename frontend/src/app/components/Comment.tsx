import ReplyButton from './NormalBtn';

const Comment = ({ author, content, time, likes }) => {
  return (
    <div className="card-comments">
      <div className="user-comment">
        <img src={author.avatar} alt="Avatar" className="w-10 h-10 rounded-full" style={{ width: '40px', height: '40px' }}/>&nbsp;{author.name}

        <div className="ml-3">
          {/* <h3 className="text-sm font-semibold">{author.name}</h3> */}
          <p className="text-xs text-gray-500" style={{ fontSize: '10px' }}>{time}</p>
        </div>
      </div>
      <p className="mt-2">{content}</p>
        <br></br><hr></hr>
        {/* <ReplyButton /> */}
      </div>

  );
};

export default Comment;
