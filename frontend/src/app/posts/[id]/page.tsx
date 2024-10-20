'use client';
import { usePathname } from 'next/navigation'
import PostContent from '../../components/PostContent';
import PostActions from '../../components/PostActions';
import CommentList from '../../components/CommentList';
import { useEffect, useState } from "react";
import ProgressBar from "@/app/components/progress_bar";
import { Post } from "@/app/types/Types";
import { randomColor } from '@/app/components/colors';

export default function Page() {
  const id = usePathname().split("/")[2];
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
        let newPost: Post = { id: data.Posts.id, author: { name: data.Posts.author.username, avatar: "/placeholder.jpg" }, time: data.Posts.created_at, content: data.Posts.content, images: data.Posts.image_url == "" ? [] : [], likes: data.Posts.likes.count };
        setPost(newPost);
        if (data.Comments) {
          setComments(data.Comments.map((comment: any) => ({ author: { name: comment.author.username, avatar: comment.author.image_url }, content: comment.content, time: comment.created_at, likes: comment.likes.count })));
        }
      });
    });
  }, [fetch]);
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
              avatar="/placeholder.jpg"
              name={post.author.name}
              time={post.time}
              content={post.content}
              images={post.images}
            />
            {/* Post Actions */}
            <PostActions likes={post.likes} id={post.id} />

            {/* Comments Section */}
            <div className="mt-4">
              <CommentList comments={comments} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

