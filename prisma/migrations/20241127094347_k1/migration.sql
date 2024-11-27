-- DropForeignKey
ALTER TABLE "Sessiondescription" DROP CONSTRAINT "Sessiondescription_session_id_fkey";

-- AddForeignKey
ALTER TABLE "Sessiondescription" ADD CONSTRAINT "Sessiondescription_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
