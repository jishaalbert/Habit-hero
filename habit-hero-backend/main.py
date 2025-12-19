from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow React to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary database (list)
habits = []

class Habit(BaseModel):
    name: str
    category: str

@app.get("/habits")
def get_habits():
    return habits

@app.post("/habits")
def add_habit(habit: Habit):
    habits.append(habit)
    return {"message": "Habit added"}
