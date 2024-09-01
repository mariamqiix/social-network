import Image from 'next/image';

const PostContent = ({ content, images, avatar, name, time }) => {
    return (
      <div className="post-card">
        <div className="postcard-user">

      <div className="user-details">
      <Image src={avatar} alt="Author's Avatar" width={50} height={50} className="w-10 h-10 rounded-full"/> &nbsp;{name}
        <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: '10px', marginLeft:'10px' }}>{time}</p>
      </div>
    </div>
    <div className="card-content">
      <p>{content}</p>
    </div>
    <div className="liked-bar">
      {/* <p><i className="fa-solid fa-heart"></i>liked by Sara Jameel & others</p> */}
    </div>
    <div className="react-bar">
      <button className="react-button"><i className="fa-solid fa-heart"></i>Like</button><br></br><br></br>
      <div className="w-100 p-2">
        <input type="text" className="form-control" name="comment" placeholder="Comment" />
        <button className="react-button"><i className="fa-solid fa-comment"></i> Comment</button>
    </div>
      {/* <button className="react-button"><i className="fa-solid fa-paper-plane"></i> Share</button> */}
    </div>
  </div>
    );
  };
  
  export default PostContent;
  