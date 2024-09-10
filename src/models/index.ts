import { TransactionEntity } from './transaction.entity';
import { Apoderado } from './Apoderado.entity';
import { Estudiante } from './Estudiante.entity';
import { ApoderadoEstudiante } from './ApoderadoEstudiante.entity';
import { ApoderadoDireccion } from './ApoderadoDireccion.entity';
import { Direccion } from './Direccion.entity';
import { Ciudad } from './Ciudad.entity';
import { Region } from './Region.entity';
import { Profesor } from './Profesor.entity';
import { Curso } from './Curso.entity';
import { EstudianteCurso } from './CursoEstudiante.entity';
import { Usuarios } from './User.entity';
import { NoticiasColegio, NoticiasImages } from './Noticias.entity';
import { Boleta } from './Boleta.entity';
import { Transacciones } from './Transacciones.entity';
import { EstadoTransaccion } from './EstadoTransaccion.entity';
import { EstadoBoleta } from './EstadoBoleta.entity';

import { Administrador } from './Administrador.entity';
import { InfoPae } from './InfoPae.entity';

import { Correo } from './Correo.entity';
import { Anotacion } from './Anotaciones.entity';
import { AnotacionesEstudiante } from './AnotacionesEstudiantes.entity';
import { Asignatura } from './Asignatura.entity';


export const entities = [Apoderado, ApoderadoEstudiante, ApoderadoDireccion,
                        Estudiante, InfoPae, Profesor, Curso, EstudianteCurso, Anotacion, AnotacionesEstudiante, Usuarios, Administrador,
                        Boleta, EstadoBoleta, Transacciones, EstadoTransaccion, TransactionEntity,
                        Direccion, Ciudad, Region, NoticiasColegio, NoticiasImages, Correo, Asignatura
                        ];

