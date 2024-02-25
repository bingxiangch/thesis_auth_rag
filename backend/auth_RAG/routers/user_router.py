from typing import Literal,List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi import Depends, FastAPI, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from auth_RAG.utils.auth import verify_password, create_access_token, decode_access_token, get_password_hash

from pydantic import BaseModel, Field
from datetime import timedelta
from typing import Annotated
from auth_RAG.services.ingest_service import IngestService
from auth_RAG.services.ingest_service import IngestedDoc
from auth_RAG.models.models import User
from auth_RAG.db.session import get_db
user_router = APIRouter(prefix="/v1")

# Token model
class Token(BaseModel):
    access_token: str
    token_type: str

class UpdateUserData(BaseModel):
    username: str
    access_level: int
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Adjust as needed

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = decode_access_token(token)

    if token_data is None:
        raise credentials_exception
    user = db.query(User).filter(User.username == token_data.get("sub")).first()
    if user is None:
        raise credentials_exception

    return user


@user_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

class UserCreate(BaseModel):
    username: str
    password: str
    access_level: int

@user_router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    hashed_password = get_password_hash(user.password)  # Replace with your actual password hashing function
    db_user = User(username=user.username, hashed_password=hashed_password, access_level = user.access_level)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@user_router.get("/users")
async def list_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@user_router.put("/users/{username}")
async def update_user_access_level(username: str, form_data: UpdateUserData, current_user: User = Security(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if user:
        user.access_level = form_data.access_level
        db.commit()
        db.refresh(user)
        return user
    
    raise HTTPException(status_code=404, detail="User not found")

@user_router.delete("/users/{username}")
async def delete_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    
    if user:
        db.delete(user)
        db.commit()
        return {"message": "User deleted"}
    
    raise HTTPException(status_code=404, detail="User not found")