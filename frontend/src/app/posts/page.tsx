// import AuthorInfo from '../components/Author-info';
import PostContent from '../components/PostContent';
import PostActions from '../components/PostActions';
import CommentList from '../components/CommentList';



export function page() {
    return <h1>You have no posts</h1>;
}

export default function PostPage() {
  const post = {
    author: {
      name: "Jessy Lincolin",
      avatar: "/placeholder.jpg",
    },
    time: "2 hours ago",
    content: "Hi everyone, today I was on the most beautiful mountain in the world 🏔, I also want to say hi to Silena, Olya, and Davis!",
    images: [
      "/placeholder.jpg",
    ],
    likes: "6355 likes",
    comments: [
      {
        author: {
          name: "Vitaliy Boyko",
          avatar: "/placeholder.jpg",
        },
        content: "Thats very nice! enjoy your time.",
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
    <div className="bg-gray-100 min-h-screen flex">
      <main className="flex-1 p-4">
        <div className="col-span-9">
          <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="postBody">
          
            {/* Post Content */}
            <PostContent 
              avatar={post.author.avatar} 
              name={post.author.name} 
              time={post.time} 
              content={post.content} 
              images={post.images} 
            />
            {/* Post Actions */}
            {/* <PostActions likes={post.likes} /> */}
            </div>
        </div>
            <br></br>
        <div className="card">   
          <div className="card-body">
            {/* Comments Section */}
            <CommentList comments={post.comments} />
            </div>
            </div>
        </div>
      </main>
    </div>
  );
}
