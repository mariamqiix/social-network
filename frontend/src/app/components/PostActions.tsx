const PostActions = ({ likes }) => {
    return (
      <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
        <div className="flex space-x-2">
          <span>❤️ {likes}</span>
        </div>
      </div>
    );
  };
  
  export default PostActions;
  