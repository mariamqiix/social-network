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

export default function Home() {
  const posts = useSelector(selectPosts);

  const dispatch = useDispatch();

  function addPostFormSubmit(form: HTMLFormElement) {
    let data = new FormData(form);
    console.log(data.get("image"));
    let imageContent = "";
    if (form.children[1].files) {
      let reader = new FileReader();
      reader.onload = function (e) {
        imageContent = e.target?.result as string;
        console.log(imageContent);
        dispatch(addPost({ author: { name: "hasan", avatar: "/placeholder.jpg" }, time: "", content: data.get("text")?.toString() ?? "", images: [imageContent], likes: 0, }));
      }
      reader.readAsDataURL(form.children[1].files[0]);
    } else {
      dispatch(addPost({ author: { name: "hasan", avatar: "/placeholder.jpg" }, time: "", content: data.get("text")?.toString() ?? "", images: [], likes: 0, }));
    }

  }

  return <div>
    <Card title="Create Post" color={colors[9]} className="m-1">
      <form onSubmit={(e: any) => {
        e.preventDefault();
        if (e.target && e.target instanceof HTMLFormElement) {
          addPostFormSubmit(e.target);
        }
      }}>
        <textarea className="w-10rea0 form-control" name="text" />
        <input type="file" name="image" />
        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn">
            <svg style={{ width: 20, marginRight: 8 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
            </svg>
            Image
          </button>
          <button className="btn btn-dark" type="submit">Post</button>
        </div>
      </form>
    </Card>
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      {posts.map((post: Post, index: number) => (
        <div key={index} style={{
          width: '100%',
          maxWidth: '900px',
          // height: '150px', // Set a fixed height
          margin: '10px 0',
          padding: '10px',
          border: '1px solid #e1e1e1',
          borderRadius: '8px',
          backgroundColor: '#fff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <PostContent
            avatar={post.author.avatar}
            name={post.author.name}
            time={post.time}
            content={post.content}
            images={post.images}
            id={index.toString()}
          />
          <PostActions likes={post.likes} />
        </div>
      ))}
    </main>
  </div>;
}
