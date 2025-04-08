-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('ini', 'boot', 'sys', 'core', 'root');

-- CreateEnum
CREATE TYPE "ExeType" AS ENUM ('fire', 'thunder', 'metal', 'neutral', 'viral');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "codename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" "Stage" NOT NULL,
    "type" "ExeType" NOT NULL,
    "pot" INTEGER NOT NULL,
    "res" INTEGER NOT NULL,
    "spd" INTEGER NOT NULL,
    "syc" INTEGER NOT NULL,
    "tec" INTEGER NOT NULL,
    "bond" INTEGER NOT NULL,
    "corruption" INTEGER NOT NULL,
    "hunger" INTEGER NOT NULL,
    "hygiene" INTEGER NOT NULL,
    "sleep" INTEGER NOT NULL,
    "isAlive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_codename_key" ON "User"("codename");

-- AddForeignKey
ALTER TABLE "Exe" ADD CONSTRAINT "Exe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
