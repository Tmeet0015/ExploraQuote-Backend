import cron from "node-cron";
import { AppDataSource } from "../data-source";
import { Packages } from "../entity/packages";
import { In, LessThanOrEqual } from "typeorm";
import { writeTableErrorLog } from "../helpers/error_log";
import { CronLog } from "../entity/cronLog";

// Schedule the CRON job to run every day at 12:30 AM
cron.schedule("30 0 * * *", async () => {
  console.log("Running CRON job: Expiring old packages...");

  try {
    const packageRepository = AppDataSource.getRepository(Packages);
    const cronLogRepository = AppDataSource.getRepository(CronLog);

    const packagesToUpdate = await packageRepository.find({
        where: { package_start_date: LessThanOrEqual(new Date()), status: "pending"},
        select: ["package_id"],
    });
  
      if (packagesToUpdate.length === 0) {
        const cronLogEntry = cronLogRepository.create({
            updated_package_ids: '',
          });
          
        await cronLogRepository.save(cronLogEntry);
        return;
      }

     const updatedPackageIds = packagesToUpdate.map((pkg) => pkg.package_id);
     await packageRepository.update(
        { package_id: In(updatedPackageIds) },
        { status: "expired" }
      );

      const cronLogEntry = cronLogRepository.create({
        updated_package_ids: updatedPackageIds.join(","),
      });

      await cronLogRepository.save(cronLogEntry);


  } catch (error) {
        const errorlog = {
          cameFrom: "CRON",
          data: error,
          token: null,
          body:  null,
        };
        writeTableErrorLog(errorlog);
  }
});
