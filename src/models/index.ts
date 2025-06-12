import { TransactionEntity } from './transaction.entity';
import { Apoderado } from './Apoderado.entity';
import { Estudiante } from './Estudiante.entity';
import { ApoderadoEstudiante } from './ApoderadoEstudiante.entity';
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
import { Correo } from './Correo.entity';
import { Anotacion } from './Anotaciones.entity';
import { AnotacionesEstudiante } from './AnotacionesEstudiantes.entity';
import { Asignatura } from './Asignatura.entity';
import { ApoderadoSuplente } from './ApoderadoSuplente.entity';
import { ApoderadoSuplenteEstudiante } from './ApoderadoSuplenteEstudiante.entity';
import { InscripcionMatricula } from './InscripcionMatricula.entity';
import { SubAdministrador } from './SubAdministrador.entity';
import { Asistencia } from './Asistencia.entity';
import { CalendarioEscolar } from './CalendarioEscolar.entity';
import { Nota } from './Notas.entity';
import { Evaluacion } from './Evaluacion.entity';
import { Semestre } from './Semestre.entity';
import { CalendarioAsistencia } from './CalendarioAsistencia';
import { PdfValidador } from './pdf-validador.entity';
import { TipoEvaluacion } from './TipoEvaluacion.entity';
import { InscripcionTaller } from './InscripcionTaller.entity';
import { TipoTaller } from './TipoTaller.entity';
import { EvaluacionPreBasica } from './EvaluacionPreBasica.entity';
import { NotaPreBasica } from './NotasPreBasica.entity';
import { AsignaturaPreBasica } from './AsignaturaPreBasica.entity';
import { TipoEvaluacionPreBasica } from './TipoEvaluacionPreBasica.entity';
import { CierreSemestre } from './CierreSemestre.entity';


export const entities = [
    // Entidades de Apoderado
    Apoderado,
    ApoderadoSuplente,
    ApoderadoSuplenteEstudiante,
    ApoderadoEstudiante,
  
    // Entidades de Estudiante
    Estudiante,
    EstudianteCurso,
    Anotacion,
    AnotacionesEstudiante,
  
    // Entidades académicas y docentes
    Profesor,
    Curso,
  
    // Asignaturas, evaluaciones y notas
    Asignatura,
    AsignaturaPreBasica,
    Evaluacion,
    EvaluacionPreBasica,
    TipoEvaluacion,
    TipoEvaluacionPreBasica,
    TipoTaller,
    Nota,
    NotaPreBasica,
    Semestre,
    CierreSemestre,
  
    // Asistencia
    Asistencia,
  
    // Usuarios y administración
    Usuarios,
    Administrador,
    SubAdministrador,
  
    // Entidades financieras y transaccionales
    Boleta,
    EstadoBoleta,
    Transacciones,
    EstadoTransaccion,
    TransactionEntity,
  
    // Noticias y comunicaciones
    NoticiasColegio,
    NoticiasImages,
    Correo,
  
    // Inscripciones
    InscripcionMatricula,
    InscripcionTaller,
  
    // Entidades menos relevantes
    PdfValidador,
    CalendarioEscolar,
    CalendarioAsistencia
  ];
  

