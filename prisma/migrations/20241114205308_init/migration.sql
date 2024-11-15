-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);
