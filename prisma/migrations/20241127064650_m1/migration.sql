-- CreateTable
CREATE TABLE "Session" (
    "session_id" TEXT NOT NULL,
    "session_image" TEXT NOT NULL,
    "session_name" TEXT NOT NULL,
    "session_mode" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "session_platform" TEXT NOT NULL,
    "session_kit" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "Sessiondescription" (
    "description_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "kit_info" TEXT NOT NULL,
    "learn1" TEXT NOT NULL,
    "learn2" TEXT NOT NULL,
    "learn3" TEXT NOT NULL,
    "other_benefits_1" TEXT NOT NULL,
    "other_benefits_2" TEXT NOT NULL,
    "other_benefits_3" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "Sessiondescription_pkey" PRIMARY KEY ("description_id")
);

-- CreateTable
CREATE TABLE "Reviewsession" (
    "reviewsession_id" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "Reviewsession_pkey" PRIMARY KEY ("reviewsession_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sessiondescription_session_id_key" ON "Sessiondescription"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviewsession_reviewsession_id_key" ON "Reviewsession"("reviewsession_id");

-- AddForeignKey
ALTER TABLE "Sessiondescription" ADD CONSTRAINT "Sessiondescription_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviewsession" ADD CONSTRAINT "Reviewsession_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
