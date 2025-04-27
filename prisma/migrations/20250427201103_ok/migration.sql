-- CreateTable
CREATE TABLE "Global" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Global_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Global" ADD CONSTRAINT "Global_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
