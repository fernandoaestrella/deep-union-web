-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "coordinates" TEXT NOT NULL,
    "userData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
