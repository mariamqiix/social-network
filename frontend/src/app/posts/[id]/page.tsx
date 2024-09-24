'use client';
import { useDispatch, useSelector } from "react-redux";
import { selectPosts } from "../../redux/selectors";
import { usePathname } from 'next/navigation'
import PostContent from '../../components/PostContent';
import PostActions from '../../components/PostActions';
import CommentList from '../../components/CommentList';

export default function Page() {
  const posts = useSelector(selectPosts);
  const id = Number.parseInt(usePathname().split("/")[2]);
  const post = posts[id];
  const likes = 1;
  const comments = [
    {
      author: {
        name: "Vitaliy Boyko",
        avatar: "/placeholder.jpg",
      },
      content: "That's very nice! enjoy your time.",
      time: "15 minutes ago",
      likes: "4 likes"
    },
    {
      author: {
        name: "John Wick",
        avatar: "/placeholder.jpg",
      },
      content: "Hello, what an adventure.",
      time: "1 day ago",
      likes: "126 likes"
    }
  ];

  return (
    <div className="container my-4">
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
          <PostActions likes={likes} />

          {/* Comments Section */}
          <div className="mt-4">
            <CommentList comments={comments} />
          </div>
        </div>
      </div>
    </div>
  );
}

