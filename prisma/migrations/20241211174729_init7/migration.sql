-- CreateTable
CREATE TABLE "Course" (
    "course_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "group_link" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("course_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_session_id_key" ON "Course"("session_id");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
