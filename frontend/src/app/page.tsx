import styles from "./page.module.css";
import PostContent from './components/PostContent';
import PostActions from './components/PostActions';
import { randomColor } from "./components/colors";

export default function Home() {
  const posts = [
    {
      author: {
        name: "Jessy Lincolin",
        avatar: "/placeholder.jpg",
      },
      time: "April 16, 2024",
      content: "Hi everyone, today I was on the most beautiful mountain in the world 🏔, I also want to say hi to Silena, Olya, and Davis!",
      images: ["/placeholder.jpg"],
      likes: "1",
    },
    {
      author: {
        name: "Fatima Mohammed",
        avatar: "/placeholder.jpg",
      },
      time: "April 16, 2024",
      content: "Hello, I just came back from the beautiful Maldives, it was a marvelous trip!",
      images: ["/placeholder.jpg"],
      likes: "1",
    },
    {
      author: {
        name: "Hassan Isa",
        avatar: "/placeholder.jpg",
      },
      time: "April 16, 2024",
      content: "Hello! This is my first post.",
      //images: ["/placeholder.jpg"],
      likes: "1",
    },
    {
      author: {
        name: "Alice Smith",
        avatar: "/placeholder.jpg",
      },
      time: "April 15, 2024",
      content: "Just finished a great book! 📚",
      //images: ["/placeholder.jpg"],
      likes: "5",
    },
  ];


  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      {posts.map((post, index) => (
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
          />
          <PostActions likes={post.likes} />
        </div>
      ))}
    </main>
  );
}
