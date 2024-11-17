import Image from 'next/image';
import { randomColor } from "../components/colors";
import Link from 'next/link';

const PostContent = ({ content, images, avatar, name, time, id = "" }) => {
  return (
    <Link href={id == "" ? "" : "/posts/" + id} className='text-decoration-none text-black'>
      <div>
        {/* Author Info */}
        <div className="d-flex align-items-center" >
          <Image
            src={avatar}
            alt="Author's Avatar"
            width={50}
            height={50}
            className="rounded-circle me-3"
          />
          <div>
            <h5>{name}</h5>
            <small className="text-secondary">{time.replace("T", " ").replace("Z", "")}</small>
          </div>
        </div>

        {/* Post Content */}
        <div className="card-body">
          <p className="card-text">{content}</p>

          {/* Post Image */}
          {images.map((image: string, i: number) => (<div className="mb-4">
            <Image
              src={images[i]}
              alt="Post Image"
              width={200}
              height={200}
              className="img-fluid rounded"
            />
          </div>))}
          {/* {images && images.length > 0 && (
            <div className="mb-4">
              <Image
                src={images[0]} // Assuming only one image is used
                alt="Post Image"
                width={200}
                height={200}
                className="img-fluid rounded"
              />
            </div>
          )} */}
        </div>
      </div>
    </Link>
  );
};

export default PostContent;

