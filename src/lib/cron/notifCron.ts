import cron from "node-cron";
import { prisma } from "@/lib/prisma";

import { getRemainingDays, _notif  } from "@/lib/sfBGS";

interface Isend {
  target: string;
  message: string;
}

async function send({ message, target }: Isend): Promise<boolean> {
  try {
    const formData = new FormData();

    formData.append("target", `0${target}`);
    formData.append("message", message);
    formData.append("countryCode", "62");
    // console.log(message,target);
    
    const resp =  await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.FONNTE_TOKEN || "oJBYQiq4PC6FQFWypQhs",
      },
      body: formData,
    });
    console.log(resp.blob.length,resp.ok);
    if(resp.blob.length == 0 || !resp.ok){
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function startNotifCron() {
  cron.schedule("* * * * *", async () => {
    console.log("Cron notif berjalan...");

    try {
      const dmsg = await prisma.notification.findMany({
        where: {
          send: false,
        },
        include: {
          pegawai: true,
        },
        take: 10,
      });
      // console.log(dmsg);
      
      for (const v of dmsg) {
        try {
          if (!v.pegawai?.noTelp) continue;

          const resp = await send({
            message: `${v.title}\n${v.message}`,
            target: v.pegawai.noTelp,
          });
          // console.log(resp);
          
          if (resp) {
            await prisma.notification.update({
              where: {
                id: v.id,
              },
              data: {
                send: true,
              },
            });

            console.log("Notif terkirim:", v.id);
          }
        } catch (error) {
          console.log("Error notif:", error);
        }
      }
    } catch (error) {
      console.log("Cron error:", error);
    }
  });
}
function waktuNotif(hari: number): boolean {
  return [90, 60, 30, 21, 14, 7].includes(hari);
}


export function noteNotifWaktu() {
  cron.schedule("0 7 * * *", async () => {
    console.log("Cron notif berjalan...");

    const pegawai = await prisma.pegawai.findMany();
    //   {
    //   where:{
    //     id:"848d60a5-4f48-11f1-aa91-2c56dcb03c3b"
    //   }
    // }
  
    for (const v of pegawai) {
      const kgb = getRemainingDays(v.tglMasaKerja, 2);
      const kp = getRemainingDays(v.tmtGolongan, 4);
      
      if (waktuNotif(kgb.remainingDays)) {
        await _notif({
          title: `Warning !!!`,
          message: ` Batas pengajuan Kenaikan Gaji Berkala tersisa ${kgb.remainingDays} hari lagi.`,
          pegawaiId: v.id,
          sumber: "KGB",
          info: "WARNING",
        });
      }

      if (waktuNotif(kp.remainingDays)) {
        await _notif({
          title: `Warning !!!`,
          message: `Batas pengajuan pengajuan Kenaikan Pangkat tersisa ${kp.remainingDays} hari lagi.`,
          pegawaiId: v.id,
          sumber: "KP",
          info: "WARNING",
        });
      }
    }
  });
}