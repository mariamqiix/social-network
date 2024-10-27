'use client';
import styles from "./page.module.css";
import PostContent from './components/PostContent';
import PostActions from './components/PostActions';
import { colors, randomColor } from "./components/colors";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts } from "./redux/selectors";
import Card from "./components/card";
import { addPost } from "./redux/actions";
import { Post } from "./types/Types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";


export default function Home() {
  const posts = useSelector(selectPosts);
  let [imageData, setImageData] = useState("");

  const dispatch = useDispatch();

  function loadImage() {
    let form = document.querySelector("form");
    if (form && form.children[1].files) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setImageData(e.target?.result as string);
      }
      reader.readAsDataURL(form.children[1].files[0]);
    }
  }

  function addPostFormSubmit(form: HTMLFormElement) {
    let data = new FormData(form);
    let imageContent = "";
    if (form.children[1].files) {
      let reader = new FileReader();
      reader.onload = function (e) {
        imageContent = e.target?.result as string;
        dispatch(addPost({ id: 0, author: { name: "hasan", avatar: "/placeholder.jpg" }, time: "", content: data.get("text")?.toString() ?? "", images: [imageContent], likes: 0, }));
      }
      reader.readAsDataURL(form.children[1].files[0]);
    } else {
      dispatch(addPost({ id: 0, author: { name: "hasan", avatar: "/placeholder.jpg" }, time: "", content: data.get("text")?.toString() ?? "", images: [], likes: 0, }));
    }
  }

  useEffect(() => {
    fetch("http://localhost:8080").then(res => {
      res.json().then(data => {
        data.Posts.forEach((post: any) => {
          dispatch(addPost({ id: post.id, author: { name: post.author.username, avatar: "/placeholder.jpg" }, time: post.created_at, content: post.content, images: post.image_url == "" ? [] : [], likes: post.likes.count }));
        });
      });
    });
  }, [dispatch]);

  return <div>
    <Card color={colors[9]} className="m-1">
      <form onSubmit={(e: any) => {
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
            document.querySelector("input[type='file']").click();
          }}>
            <FontAwesomeIcon icon={faImage} className="me-2" />
            Image
            {imageData != "" ? <img src={imageData} height={20} className="mx-2" /> : <div></div>}
          </button>
          <button className="btn btn-dark" type="submit">Post</button>
        </div>
      </form>
    </Card>
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      {posts.map((post: Post, index: number) => (
        <div key={index} className="card shadow-sm p-4" style={{
          width: '100%',
          maxWidth: '900px',
          // height: '150px', // Set a fixed height
          margin: '10px 0',
          padding: '10px',
          border: '1px solid #e1e1e1',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: randomColor(), // Set the background color to a random color
        }}>
          <PostContent
            avatar={post.author.avatar}
            name={post.author.name}
            time={post.time}
            content={post.content}
            images={post.images}
            id={post.id.toString()}
          />
          <PostActions likes={post.likes} id={post.id} />
        </div>
      ))}
    </main>
  </div>;
}
