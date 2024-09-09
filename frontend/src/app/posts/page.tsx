import PostContent from '../components/PostContent';
import PostActions from '../components/PostActions';
import CommentList from '../components/CommentList';

export default function PostPage() {
  const post = {
    author: {
      name: "Jessy Lincolin",
      avatar: "/placeholder.jpg",
    },
    time: "April 16, 2024",
    content: "Hi everyone, today I was on the most beautiful mountain in the world 🏔, I also want to say hi to Silena, Olya, and Davis!",
    images: [
      "/placeholder.jpg", // Your uploaded image
    ],
    likes: "1",
    comments: [
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
    ]
  };

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
          <PostActions likes={post.likes} />

          {/* Comments Section */}
          <div className="mt-4">
            <CommentList comments={post.comments} />
          </div>
        </div>
      </div>
    </div>
  );
}

