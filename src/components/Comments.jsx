function Comments({ comments }) {
    return (
      <div className="comments">
        {comments.length === 0 ? (
          <p>Aucun commentaire.</p>
        ) : (
          comments.map((comment, idx) => (
            <div key={idx} className="comment">
              <strong>
                {comment.name} ({comment.rating}★)
              </strong>
              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    );
  }
  
  export default Comments;
  