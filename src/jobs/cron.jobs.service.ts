import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { ResumenApoderadoMorosoDto } from 'src/dto/apoderado.dto';
import { BoletaService } from 'src/modules/Boleta/boleta.service';
import { CorreoService } from 'src/modules/Correo/correo.service';

@Injectable()
export class CronTasksService {
  private readonly logger = new Logger(CronTasksService.name);

  constructor(
    private readonly boletaService: BoletaService,
    private readonly correoService: CorreoService,
  ) { }

  /**
   * Lunes, Miércoles y Viernes a las 08:00 AM (Chile)
   */
  // @Cron('* * * * *', {
  @Cron('0 8 * * 1,3,5', {
    name: 'morososLunMieVie',
    timeZone: 'America/Santiago',
  })
  async handleMorososLunMieVie() {
    this.logger.log('🚀 Envío de correos a morosos: Lunes, Miércoles y Viernes a las 08:00');

    const morosos: ResumenApoderadoMorosoDto[] = await this.boletaService.getApoderadosMorososNew();
    this.logger.log(`📧 Enviando correos a ${morosos.length} apoderados morosos...`);

    for (const moroso of morosos) {
      this.logger.log(`✉️ Preparando correo para ${moroso.nombre} <${moroso.correo}>`);

      const html = await this.boletaService.buildHtmlMoroso(moroso);
      const mailOptions = {
        from: 'contacto@colegioandeschile.cl',
        to: moroso.correo,
        subject: 'Recordatorio de pago vencido',
        html,
      };

      try {
        await this.correoService.enviarCorreo(mailOptions);
        this.logger.log(`✅ Correo enviado a ${moroso.correo}`);
      } catch (err) {
        this.logger.error(`❌ Error enviando a ${moroso.correo}`, err.stack);
      }
    }

    this.logger.log('✅ Proceso de envío de morosos completado');
  }

  // // cada minuto, usando la zona America/Santiago
  // @Cron('* * * * *', {
  //   name: 'everyMinute',
  //   timeZone: 'America/Santiago',
  // })
  // handleEveryMinute() {
  //   this.logger.debug('🔄 Tarea ejecutada cada minuto');
  // }

  // // lunes a las 03:30 AM, zona America/Santiago
  // @Cron('30 3 * * 1', {
  //   name: 'weeklyCleanup',
  //   timeZone: 'America/Santiago',
  // })
  // handleWeeklyCleanup() {
  //   this.logger.log('🧹 Limpieza semanal a las 03:30 AM');
  // }

  // @Interval(10_000)
  // handleInterval() {
  //   this.logger.debug('⏱️ Intervalo de 10 segundos');
  // }

  // @Timeout(5_000)
  // handleTimeout() {
  //   this.logger.debug('⏰ Timeout único tras 5 segundos');
  // }
}
