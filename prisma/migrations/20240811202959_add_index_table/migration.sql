-- CreateTable
CREATE TABLE "IndexState" (
    "id" SERIAL NOT NULL,
    "page" INTEGER NOT NULL,

    CONSTRAINT "IndexState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndexState_page_key" ON "IndexState"("page");
