"use client";
import styles from "./page.module.css";
import PostContent from "./components/PostContent";
import PostActions from "./components/PostActions";
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
import Select from "react-select";
import Link from "next/link";
import SearchBar from "./components/search_bar";
import NotificationsBox from "./components/Notifications";

export default function Home() {
  const posts = useSelector(selectPosts);
  const user = useSelector(selectUser);
  let [imageData, setImageData] = useState("");
  let [privacyChoice, setPrivacy] = useState("Public");
  let [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  let [users, setUsers] = useState<any[]>([]);
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
      };
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
          sendPost(data.get("text")?.toString()!, privacyChoice, imageContent);
        }
      };
      reader.readAsDataURL(form.children[1].files[0]);
    } else {
      if (data.get("text")) {
        sendPost(data.get("text")?.toString()!, privacyChoice, null);
      }
    }
  }

  function sendPost(content: string, privacy: string, image: string | null) {
    console.log(privacy);
    if (user) {
      fetch("http://localhost:8080/post/createPost/user", {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          description: content,
          image: image == null ? null : image.substring(image.indexOf(",") + 1),
          privacy: privacy,
          recipient: privacy == "Almost" ? selectedUsers : [],
        }),
      }).then((res) => {
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
    fetch("http://localhost:8080", { credentials: "include" }).then((res) => {
      res.json().then((data) => {
        console.log(data.Posts);
        data.Posts.forEach((post: any) => {
          if (post) {
            dispatch(
              addPost({
                id: post.id,
                author: {
                  id: post.author.id,
                  name: post.author.username,
                  avatar: "data:image/jpeg;base64," + post.author.image_url,
                },
                time: post.created_at,
                content: post.content,
                images:
                  post.image_url == ""
                    ? []
                    : ["data:image/jpeg;base64," + post.image_url],
                likes: post.likes.count,
              })
            );
          }
        });
      });
    });

    fetch("http://localhost:8080/user/list/").then((res) => {
      res.json().then((data) => {
        let newUsers: any[] = [];
        data.forEach((user: any) => {
          // console.log(user);
          newUsers.push([user.Username, user.ID]);
        });
        setUsers(newUsers.map((u) => ({ label: u[0], value: u[1] })));
      });
    });
  }, [dispatch]);

  function likePostClicked(id: Number) {
    fetch("http://localhost:8080/post/addReaction", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ post_id: id, reaction: "Like" }),
    }).then((res) => {
      console.log(res.status);
      if (res.status == 204) {
        dispatch(likePost(id, -1));
      } else if (res.status == 201) {
        dispatch(likePost(id, 1));
      }
    });
  }

  return (
    <div>
      <div className="d-flex flex-row align-items-center">
        <SearchBar />
      </div>
      <Card color={colors[9]} className="m-1">
        {user != null ? (
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              if (e.target && e.target instanceof HTMLFormElement) {
                addPostFormSubmit(e.target);
              }
            }}
          >
            <textarea className="w-10rea0 form-control" name="text" />
            <input
              type="file"
              name="image"
              className="d-none"
              accept="image/*"
              onChange={() => {
                loadImage();
              }}
            />
            <div className="d-flex justify-content-between mt-3">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    if (!isImageSelected) {
                      // Only open file selector if no image is selected
                      document.querySelector("input[type='file']").click();
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faImage} className="me-2" />
                  Image
                  {imageData !== "" ? (
                    <>
                      <img src={imageData} height={20} className="mx-2" />
                      <span
                        onClick={deselectImage}
                        style={{
                          color: "red",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "0.8rem",
                        }}
                      >
                        {" "}
                        {/* Adjusted font size */}
                        Remove
                      </span>{" "}
                      {/* Deselect as red text */}
                    </>
                  ) : (
                    <div></div>
                  )}
                </button>
                <select
                  className="rounded"
                  name="privacy"
                  value={privacyChoice}
                  onChange={(e) => {
                    setPrivacy(e.target.value);
                  }}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Almost">Almost Private</option>
                </select>
              </div>
              <button className="btn btn-dark" type="submit">
                Post
              </button>
            </div>
            {privacyChoice == "Almost" ? (
              <div>
                Choose the users:
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  options={users}
                  onChange={(newValue) => {
                    // console.log(newValue);
                    setSelectedUsers(newValue.map((val) => val.value));
                    // console.log(selectedUsers);
                  }}
                />
              </div>
            ) : (
              <div></div>
            )}
          </form>
        ) : (
          <p>Login to create post</p>
        )}
      </Card>
      <main style={{ display: "flex", flexDirection: "column" }}>
        {posts.map((post: Post, index: number) => (
          <div
            key={index}
            className="card shadow-sm p-4"
            style={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              border: "1px solid #e1e1e1",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              backgroundColor: randomColor(),
            }}
          >
            <PostContent
              avatar={post.author.avatar}
              name={post.author.name}
              userID={post.author.id}
              time={post.time}
              content={post.content}
              images={post.images}
              id={post.id.toString()}
            />
            <Link href={"posts/" + post.id}>
              <Link href={"posts/" + post.id}>
                {user && (
                  <PostActions
                    likes={post.likes}
                    liked={() => likePostClicked(post.id)}
                  />
                )}
              </Link>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
