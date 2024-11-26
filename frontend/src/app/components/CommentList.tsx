import Comment from './Comment';
import { colors } from "../components/colors";
import "./buttons.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { useState } from 'react';


const CommentList = ({ comments, addComment }: { comments: any[], addComment: Function }) => {
  let [imageData, setImageData] = useState<string | null>(null);
  function loadImage() {
    let imageInput = document.getElementById("commentImage");
    if (imageInput && imageInput.files) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setImageData((e.target?.result as string));
      }
      reader.readAsDataURL(imageInput.files[0]);
    }
  }
  return (
    <div className="mt-4">
      <h5 className="mb-4">Comments</h5>
      <form onSubmit={(e) => {
        e.preventDefault();
        let data = new FormData(e.target as HTMLFormElement);
        addComment(data.get("content"), imageData);
        (e.target as HTMLFormElement).reset();
      }}>
        <textarea className="w-10rea0 form-control" name="content"></textarea>
        <input id="commentImage" type='file' className="d-none" accept="image/*" onChange={loadImage} />
        <div className='mt-2 d-flex justify-content-between'>
          <div>
            <button type='button' className='btn' onClick={() => {
              document.getElementById("commentImage")?.click();
            }}>
              <FontAwesomeIcon icon={faImage} className="me-2" />
              Image
              <img src={imageData ?? ""} height={20} className="mx-2"></img>
            </button>
            {imageData != null && (
              <button className='btn btn-link ' onClick={() => {
                setImageData(null);
              }}>
                Remove
              </button>
            )}
          </div>

          <button type='submit' className='btn btn-purple border-0'>Add Comment</button>
        </div>
      </form>
      <br />
      {comments != null ?

        comments.map((comment, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body" style={{
              backgroundColor: colors[index % colors.length], // Set the background color to a random color
            }}>
              <Comment
                author={comment.author}
                content={comment.content}
                image={comment.image}
                time={comment.time}
              />
            </div>
          </div>
        ))
        : <p>No comments</p>}
    </div>
  );
};

export default CommentList;


