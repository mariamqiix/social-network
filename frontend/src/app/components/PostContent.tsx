import Image from 'next/image';
import { randomColor } from "../components/colors";
import Link from 'next/link';

const PostContent = ({ content, images, avatar, name, time, id = "" }) => {
  return (
    <Link href={id == "" ? "" : "/posts/" + id} className='text-decoration-none'>
      <div className="card mb-4 shadow-sm">
        {/* Author Info */}
        <div className="card-header d-flex align-items-center" style={{
          backgroundColor: randomColor(), // Set the background color to a random color
        }}>
          <Image
            src={"/placeholder.jpg"}
            alt="Author's Avatar"
            width={50}
            height={50}
            className="rounded-circle me-3"
          />
          <div>
            <h5 className="mb-0">{name}</h5>
            <small className="text-muted">{time}</small>
          </div>
        </div>

        {/* Post Content */}
        <div className="card-body">
          <p className="card-text">{content}</p>

          {/* Post Image */}
          {images && images.length > 0 && (
            <div className="mb-4">
              <Image
                src={images[0]} // Assuming only one image is used
                alt="Post Image"
                width={200}
                height={200}
                className="img-fluid rounded"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostContent;

