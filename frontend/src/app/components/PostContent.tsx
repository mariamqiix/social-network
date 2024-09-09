import Image from 'next/image';

const PostContent = ({ content, images, avatar, name, time }) => {
    return (
      <div className="card mb-4 shadow-sm">
        {/* Author Info */}
        <div className="card-header d-flex align-items-center">
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
                src={"/placeholder.jpg"} // Assuming only one image is used
                alt="Post Image"
                width={600}
                height={300}
                className="img-fluid rounded"
              />
            </div>
          )}
        </div>
      </div>
    );
};

export default PostContent;

