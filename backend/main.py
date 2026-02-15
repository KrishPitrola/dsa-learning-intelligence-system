from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.quiz import router as quiz_router
from routes.analytics import router as analytics_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(quiz_router)
app.include_router(analytics_router)