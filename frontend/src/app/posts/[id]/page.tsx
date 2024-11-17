'use client';
import { usePathname } from 'next/navigation'
import PostContent from '../../components/PostContent';
import PostActions from '../../components/PostActions';
import CommentList from '../../components/CommentList';
import { useEffect, useState } from "react";
import ProgressBar from "@/app/components/progress_bar";
import { Post } from "@/app/types/Types";
import { randomColor } from '@/app/components/colors';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/redux/selectors';

export default function Page() {
  const id = usePathname().split("/")[2];
  const user = useSelector(selectUser);
  type Comment =
    {
      author: {
        name: string,
        avatar: string,
      },
      content: string,
      time: string,
      likes: number
    };
  const [comments, setComments] = useState<null | Comment[]>(null);
  const [post, setPost] = useState<null | Post>(null)
  useEffect(() => {
    fetch("http://localhost:8080/postPage?id=" + id, { credentials: 'include' }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        let newPost: Post = { id: data.Posts.id, author: { name: data.Posts.author.username, avatar: "data:image/jpeg;base64," + data.Posts.author.image_url }, time: data.Posts.created_at, content: data.Posts.content, images: data.Posts.image_url == "" ? [] : ["data:image/jpeg;base64,"+data.Posts.image_url], likes: data.Posts.likes.count };
        setPost(newPost);
        if (data.Comments) {
          setComments(data.Comments.map((comment: any) => ({ author: { name: comment.author.username, avatar: "data:image/jpeg;base64," + comment.author.image_url }, content: comment.content, time: comment.created_at, likes: comment.likes.count })));
        }
      });
    });
  }, [fetch]);
  function likePost() {
    fetch("http://localhost:8080/post/addReaction", { method: "POST", credentials: 'include', body: JSON.stringify({ post_id: Number.parseInt(id), reaction: "Like" }) }).then((res) => {
      console.log(res.status);
      if (res.status == 204) {
        // console.log("remove");
        setPost({ ...post, likes: post?.likes - 1 });
      } else if (res.status == 201) {
        // console.log("add");
        setPost({ ...post, likes: post?.likes + 1 });
      }

    });
  }
  function addComment(text: string) {
    fetch("http://localhost:8080/post/addComment/user", { method: "POST", credentials: 'include', body: JSON.stringify({ parent_id: Number.parseInt(id), description: text }) }).then((res) => {
      console.log(res.status);
      if (res.status == 201) {
        console.log("Comment added");
        setComments([...(comments == null ? [] : comments), { author: { name: user?.username, avatar: user?.image_url }, content: text, time: (new Date()).toISOString(), likes: 0 }]);
      }
      res.text().then((data) => {
        console.log(data);
      });
    });
  }
  if (post == null) {
    return <ProgressBar progress={1} />;
  } else {
    return (
      <div className="card my-4 p-3 shadow-sm border-0" style={{
        backgroundColor: randomColor(),
      }}>
        <div className="row justify-content-center">
          {/* Use a wider column */}
          <div className="col-lg-10">
            {/* Post Content */}
            <PostContent
              avatar={post.author.avatar}
              name={post.author.name}
              time={post.time}
              content={post.content}
              images={post.images}
            />
            {/* Post Actions */}
            <PostActions likes={post.likes} liked={likePost} />

            {/* Comments Section */}
            <div className="mt-4">
              <CommentList comments={comments} addComment={addComment} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

