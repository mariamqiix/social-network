'use client';
import styles from "./page.module.css";
import PostContent from './components/PostContent';
import PostActions from './components/PostActions';
import { colors, randomColor } from "./components/colors";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, selectUser } from "./redux/selectors";
import Card from "./components/card";
import { addPost, likePost } from "./redux/actions";
import { Post } from "./types/Types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Home() {
  const posts = useSelector(selectPosts);
  const user = useSelector(selectUser);
  let [imageData, setImageData] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false); // New state to track image selection

  const dispatch = useDispatch();
  const router = useRouter();

  function loadImage() {
    let form = document.querySelector("form");
    if (form && form.children[1].files) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setImageData(e.target?.result as string);
        setIsImageSelected(true); // Set to true when an image is selected
      }
      reader.readAsDataURL(form.children[1].files[0]);
    }
  }

  function deselectImage() {
    setImageData(""); // Clear the image data
    setIsImageSelected(false); // Set to false when the image is deselected
    let form = document.querySelector("form");
    if (form && form.children[1]) {
      form.children[1].value = ""; // Clear the file input
    }
  }

  function addPostFormSubmit(form: HTMLFormElement) {
    let data = new FormData(form);
    let imageContent: string | undefined;
    if (form.children[1].files.length > 0) {
      let reader = new FileReader();
      reader.onload = function (e) {
        imageContent = e.target?.result as string;
        if (data.get("text") && imageContent) {
          sendPost(data.get("text")?.toString()!, imageContent);
        }
      }
      reader.readAsDataURL(form.children[1].files[0]);
    } else {
      if (data.get("text")) {
        sendPost(data.get("text")?.toString()!, null);
      }
    }
  }

  function sendPost(content: string, image: string | null) {
    console.log(content, image.indexOf(","), image.substring(image.indexOf(",") + 1));
    if (user) {
      fetch("http://localhost:8080/post/createPost/user", {
        credentials: 'include', method: "POST", body: JSON.stringify({
          description: content,
          image: image == null ? null : image.substring(image.indexOf(",") + 1),
          privacy: "Public",
          recipient: [],
        })
      }).then(res => {
        console.log(res.status);
        if (res.status == 200) {
          window.location.reload();
        }
        // res.text().then(data => {
        // console.log(data);
        // dispatch(addPost({ id: 0, author: { name: user.username, avatar: user.image_url ?? "/placeholder.jpg" }, time: (new Date()).toISOString(), content, images, likes: 0, }));
        // });
      });
    }
  }

  useEffect(() => {
    fetch("http://localhost:8080").then(res => {
      res.json().then(data => {
        // console.log(data.Posts);
        data.Posts.forEach((post: any) => {
          if (post) {
            dispatch(addPost({ id: post.id, author: { name: post.author.username, avatar: "data:image/jpeg;base64," + post.author.image_url }, time: post.created_at, content: post.content, images: post.image_url == "" ? [] : ["data:image/jpeg;base64," + post.image_url], likes: post.likes.count }));
          }
        });
      });
    });
  }, [dispatch]);

  function likePostClicked(id: Number) {
    fetch("http://localhost:8080/post/addReaction", { method: "POST", credentials: 'include', body: JSON.stringify({ post_id: id, reaction: "Like" }) }).then((res) => {
      console.log(res.status);
      if (res.status == 204) {
        dispatch(likePost(id, -1));
      } else if (res.status == 201) {
        dispatch(likePost(id, 1));
      }
    });
  }

  return <div>
    <Card color={colors[9]} className="m-1">
      {user != null ? <form onSubmit={(e: any) => {
        e.preventDefault();
        if (e.target && e.target instanceof HTMLFormElement) {
          addPostFormSubmit(e.target);
        }
      }}>
        <textarea className="w-10rea0 form-control" name="text" />
        <input type="file" name="image" className="d-none" onChange={() => {
          loadImage();
        }} />
        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn" onClick={() => {
            if (!isImageSelected) { // Only open file selector if no image is selected
              document.querySelector("input[type='file']").click();
            }
          }}>
            <FontAwesomeIcon icon={faImage} className="me-2" />
            Image
            {imageData !== "" ? (
              <>
                <img src={imageData} height={20} className="mx-2" />
                <span
                  onClick={deselectImage}
                  style={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}> {/* Adjusted font size */}
                  Remove
                </span> {/* Deselect as red text */}
              </>
            ) : <div></div>}
          </button>
          <button className="btn btn-dark" type="submit">Post</button>
        </div>
      </form> : <p>Login in to create post</p>}
    </Card>
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      {posts.map((post: Post, index: number) => (
        <div key={index} className="card shadow-sm p-4" style={{
          width: '100%',
          margin: '10px 0',
          padding: '10px',
          border: '1px solid #e1e1e1',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: randomColor(),
        }}>
          <PostContent
            avatar={post.author.avatar}
            name={post.author.name}
            time={post.time}
            content={post.content}
            images={post.images}
            id={post.id.toString()}
          />
          <PostActions likes={post.likes} liked={() => likePostClicked(post.id)} />
        </div>
      ))}
    </main>
  </div>;
}
