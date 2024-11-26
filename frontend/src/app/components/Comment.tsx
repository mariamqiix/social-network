const Comment = ({ author, content, image, time }: { author: any, content: string, image: string, time: string }) => {
  return (
    <div className="d-flex align-items-start">
      <img
        src={author.avatar}
        alt="Avatar"
        className="rounded-circle"
        style={{ width: '40px', height: '40px', marginRight: '10px' }}
      />
      <div>
        <h6 className="mb-1">{author.name}</h6>
        <small className="text-muted">{time}</small>
        <p className="mt-2 mb-1">{content}</p>
        <img src={image} className="w-100"></img>
      </div>
    </div>
  );
};

export default Comment;
