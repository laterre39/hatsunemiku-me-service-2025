-- CreateTable
CREATE TABLE "voca_news" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "title_jp" TEXT NOT NULL,
    "title_kr" TEXT NOT NULL,

    CONSTRAINT "voca_news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voca_news_external_id_key" ON "voca_news"("external_id");
