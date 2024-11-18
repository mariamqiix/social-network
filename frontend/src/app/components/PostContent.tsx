import Image from 'next/image';
import { randomColor } from "../components/colors";
import Link from 'next/link';

const PostContent = ({ content, images, avatar, name, userID, time, id = "" }) => {
  return (
    <Link href={id == "" ? "" : "/posts/" + id} className='text-decoration-none text-black'>
      <div>
        {/* Author Info */}
        <div className="d-flex align-items-center" >
          <Link href={"/profile/" + userID}>
            <Image
              src={avatar}
              alt="Author's Avatar"
              width={50}
              height={50}
              className="rounded-circle me-3"
            />
          </Link>
          <div>
            <h5>{name}</h5>
            <small className="text-secondary">{time.replace("T", " ").replace("Z", "")}</small>
          </div>
        </div>
        {/* Post Content */}
        <div className="card-body">
          <p className="card-text">{content}</p>

          {/* Post Image */}
          {images.map((image: string, i: number) => (
            <Image
              key={"image" + i}
              src={image}
              alt="Post Image"
              width={500}
              height={500}
              className="img-fluid rounded ms-auto me-auto d-block"
            />))}
        </div>
      </div>
    </Link >
  );
};

export default PostContent;

