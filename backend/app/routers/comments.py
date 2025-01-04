from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Comment
from ..schemas import CommentResponse, CommentCreate
from .auth import get_current_user
from ..database import SessionLocal

router = APIRouter(prefix="/comments", tags=["comments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/products/{product_id}", response_model=list[CommentResponse])
def get_comments(product_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.product_id == product_id).all()
    return comments

@router.post("/", response_model=CommentResponse)
def add_comment(comment: CommentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_comment = Comment(
        content=comment.content,
        rating=comment.rating,
        product_id=comment.product_id,
        user_id=user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != user.id and not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
