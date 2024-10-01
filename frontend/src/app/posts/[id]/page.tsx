'use client';
import { useDispatch, useSelector } from "react-redux";
import { selectPosts } from "../../redux/selectors";
import { usePathname } from 'next/navigation'
import PostContent from '../../components/PostContent';
import PostActions from '../../components/PostActions';
import CommentList from '../../components/CommentList';
import { useEffect, useState } from "react";
import ProgressBar from "@/app/components/progress_bar";

export default function Page() {
  // const posts = useSelector(selectPosts);
  const id = usePathname().split("/")[2];
  // const likes = 1;
  // const comments = [
  //   {
  //     author: {
  //       name: "Vitaliy Boyko",
  //       avatar: "/placeholder.jpg",
  //     },
  //     content: "That's very nice! enjoy your time.",
  //     time: "15 minutes ago",
  //     likes: "4 likes"
  //   },
  //   {
  //     author: {
  //       name: "John Wick",
  //       avatar: "/placeholder.jpg",
  //     },
  //     content: "Hello, what an adventure.",
  //     time: "1 day ago",
  //     likes: "126 likes"
  //   }
  // ];
  const [post, setPost] = useState(null)
  console.log("http://localhost:8080/postPage/" + id);
  useEffect(() => {
    fetch("http://localhost:8080/postPage/" + id, { credentials: 'include' }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        // setPost(data);
      });
    });
  }, [fetch]);
  if (post == null) {
    return <ProgressBar progress={1}/>;
  } else if (post != null) {
    return (
      <div className="container my-4">
        <div className="row justify-content-center">
          {/* Use a wider column */}
          <div className="col-lg-10">
            {/* Post Content */}
            <PostContent
              avatar="/placeholder.jpg"
              name={post.author.username}
              time={post.created_at}
              content={post.content}
              images={post.image_url == "" ? [] : [post.image_url]}
            />

            {/* Post Actions */}
            <PostActions likes={15} />

            {/* Comments Section */}
            <div className="mt-4">
              {/* <CommentList comments={comments} /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

