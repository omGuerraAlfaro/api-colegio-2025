CREATE TABLE `apoderado` (
  `id` int(11) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `rut` varchar(10) NOT NULL,
  `dv` char(1) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo_electronico` varchar(100) DEFAULT NULL,
  `estado_civil` varchar(20) DEFAULT NULL,
  `nacionalidad` varchar(50) DEFAULT NULL,
  `actividad` varchar(100) DEFAULT NULL,
  `escolaridad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `apoderado_direccion` (
  `apoderado_id` int(11) NOT NULL,
  `direccion_id` int(11) NOT NULL,
  `tipo_direccion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `apoderado_estudiante` (
  `apoderado_id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `boleta` (
  `id` int(11) NOT NULL,
  `apoderado_id` int(11) NOT NULL,
  `pago_id` int(11) DEFAULT NULL,
  `estado_id` int(11) NOT NULL,
  `detalle` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `iva` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `descuento` decimal(10,2) DEFAULT NULL,
  `nota` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ciudad` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `region_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ciudad` (`id`, `nombre`, `region_id`) VALUES
(1, 'Putre', 1),
(2, 'Camarones', 1),
(3, 'Alto Hospicio', 2),
(4, 'Pozo Almonte', 2),
(5, 'Huara', 2),
(6, 'Pica', 2),
(7, 'Calama', 3),
(8, 'Tocopilla', 3),
(9, 'Mejillones', 3),
(10, 'San Pedro de Atacama', 3),
(11, 'María Elena', 3),
(12, 'Vallenar', 4),
(13, 'Domeyko', 4),
(14, 'Tierra Amarilla', 4),
(15, 'Chañaral', 4),
(16, 'Diego de Almagro', 4),
(17, 'Ovalle', 5),
(18, 'Illapel', 5),
(19, 'Vicuña', 5),
(20, 'Salamanca', 5),
(21, 'Andacollo', 5),
(22, 'Monte Patria', 5),
(23, 'San Antonio', 6),
(24, 'Quilpué', 6),
(25, 'Villa Alemana', 6),
(26, 'San Felipe', 6),
(27, 'Quillota', 6),
(28, 'La Ligua', 6),
(29, 'Zapallar', 6),
(30, 'Los Andes', 6),
(31, 'Cabildo', 6),
(32, 'Calera', 6),
(33, 'Cartagena', 6),
(34, 'El Quisco', 6),
(35, 'El Tabo', 6),
(36, 'La Calera', 6),
(37, 'La Cruz', 6),
(38, 'Limache', 6),
(39, 'Olmué', 6),
(40, 'Petorca', 6),
(41, 'Puchuncaví', 6),
(42, 'Rinconada', 6),
(43, 'Santo Domingo', 6),
(44, 'San Fernando', 7),
(45, 'Santa Cruz', 7),
(46, 'Pichilemu', 7),
(47, 'Machalí', 7),
(48, 'Cauquenes', 8),
(49, 'Curicó', 8),
(50, 'Linares', 8),
(51, 'Parral', 8),
(52, 'Molina', 8),
(53, 'Constitución', 8),
(54, 'Bulnes', 9),
(55, 'San Carlos', 9),
(56, 'Yungay', 9),
(57, 'Quirihue', 9),
(58, 'Coelemu', 9),
(59, 'El Carmen', 9),
(60, 'Los Ángeles', 10),
(61, 'Talcahuano', 10),
(62, 'Chiguayante', 10),
(63, 'Coronel', 10),
(64, 'Lota', 10),
(65, 'Tomé', 10),
(66, 'Hualpén', 10),
(67, 'Angol', 11),
(68, 'Villarrica', 11),
(69, 'Pucón', 11),
(70, 'Lautaro', 11),
(71, 'Nueva Imperial', 11),
(72, 'La Unión', 12),
(73, 'Río Bueno', 12),
(74, 'Panguipulli', 12),
(75, 'Paillaco', 12),
(76, 'Osorno', 13),
(77, 'Castro', 13),
(78, 'Ancud', 13),
(79, 'Frutillar', 13),
(80, 'Fresia', 13),
(81, 'Chaitén', 13),
(82, 'Aysén', 14),
(83, 'Puerto Aysén', 14),
(84, 'Chile Chico', 14),
(85, 'Cochrane', 14),
(86, 'Coyhaique', 14),
(87, 'Puerto Natales', 15),
(88, 'Porvenir', 15),
(89, 'Cerro Sombrero', 15),
(90, 'Punta Arenas', 15),
(91, 'Puerto Williams', 15),
(92, 'Buin', 16),
(93, 'Cerro Navia', 16),
(94, 'Colina', 16),
(95, 'Conchalí', 16),
(96, 'Curacaví', 16),
(97, 'El Bosque', 16),
(98, 'El Monte', 16),
(99, 'Estación Central', 16),
(100, 'Huechuraba', 16),
(101, 'Independencia', 16),
(102, 'Isla de Maipo', 16),
(103, 'La Cisterna', 16),
(104, 'La Granja', 16),
(105, 'La Reina', 16),
(106, 'Lampa', 16),
(107, 'Lo Barnechea', 16),
(108, 'Lo Espejo', 16),
(109, 'Lo Prado', 16),
(110, 'Macul', 16),
(111, 'María Pinto', 16),
(112, 'Melipilla', 16),
(113, 'Ñuñoa', 16),
(114, 'Pedro Aguirre Cerda', 16),
(115, 'Peñalolén', 16),
(116, 'Pirque', 16),
(117, 'Providencia', 16),
(118, 'Pudahuel', 16),
(119, 'Quilicura', 16),
(120, 'Quinta Normal', 16),
(121, 'Recoleta', 16),
(122, 'Renca', 16),
(123, 'San Bernardo', 16),
(124, 'San Joaquín', 16),
(125, 'San José de Maipo', 16),
(126, 'San Miguel', 16),
(127, 'San Pedro', 16),
(128, 'Santa María', 16),
(129, 'Santiago', 16),
(130, 'Talagante', 16),
(131, 'Tiltil', 16),
(132, 'Vitacura', 16);

CREATE TABLE `curso` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nivel_grado` varchar(50) DEFAULT NULL,
  `profesor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `curso` (`id`, `nombre`, `descripcion`, `nivel_grado`, `profesor_id`) VALUES
(1, 'Pre-Kinder', 'Curso de nivelación inicial', 'Pre-Kinder', 8),
(2, 'Kinder', 'Curso de nivelación inicial', 'Kinder', 11),
(3, '1ero Básico', 'Curso de educación básica', '1ero Básico', 14),
(4, '2do Básico', 'Curso de educación básica', '2do Básico', 16),
(5, '3ero Básico A', 'Curso de educación básica', '3ero Básico', 1),
(6, '3ero Básico B', 'Curso de educación básica', '3ero Básico', 7),
(7, '4to Básico A', 'Curso de educación básica', '4to Básico', 13),
(8, '4to Básico B', 'Curso de educación básica', '4to Básico', 3),
(9, '5to Básico', 'Curso de educación básica', '5to Básico', 9),
(10, '6to Básico A', 'Curso de educación básica', '6to Básico', 15),
(11, '6to Básico B', 'Curso de educación básica', '6to Básico', 10),
(12, '7mo Básico A', 'Curso de educación básica', '7mo Básico', 6),
(13, '7mo Básico B', 'Curso de educación básica', '7mo Básico', 4),
(14, '8vo Básico', 'Curso de educación básica', '8vo Básico', 5);

CREATE TABLE `direccion` (
  `id` int(11) NOT NULL,
  `calle` varchar(255) NOT NULL,
  `numero` varchar(50) NOT NULL,
  `departamento` varchar(50) DEFAULT NULL,
  `codigo_postal` varchar(50) DEFAULT NULL,
  `ciudad_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `direccion` (`id`, `calle`, `numero`, `departamento`, `codigo_postal`, `ciudad_id`) VALUES
(1, 'Calle Principal', '1234', '5A', '56789', 4),
(2, 'Avenida Secundaria', '5678', '3B', '56790', 2),
(3, 'Calle Tercera', '9101', NULL, '56791', 55),
(4, 'Avenida Cuarta', '1121', '9C', '56792', 33),
(5, 'Calle Quinta', '3141', '2D', '56793', 28);

CREATE TABLE `estado_boleta` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `estado_boleta` (`id`, `descripcion`) VALUES
(1, 'Pagada'),
(2, 'Pendiente'),
(3, 'Anulada');

CREATE TABLE `estudiante` (
  `id` int(11) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `rut` varchar(10) NOT NULL,
  `dv` char(1) NOT NULL,
  `telefono_contacto` varchar(15) DEFAULT NULL,
  `genero` varchar(10) DEFAULT NULL,
  `alergico` varchar(100) DEFAULT NULL,
  `vive_con` varchar(100) DEFAULT NULL,
  `enfermedad_cronica` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `estudiante_curso` (
  `estudiante_id` int(11) NOT NULL,
  `curso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pago` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `tipo_pago_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `profesor` (
  `id` int(11) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `rut` varchar(10) NOT NULL,
  `dv` char(1) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `especialidad` varchar(50) DEFAULT NULL,
  `correo_electronico` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `profesor` (`id`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `rut`, `dv`, `telefono`, `especialidad`, `correo_electronico`) VALUES
(1, 'Maria', 'Olga', 'Bravo', 'Caceres', '15818487', '7', '966886435', 'Lenguaje', 'mariaolgabravo.cach@gmail.com'),
(2, 'Fabiola', 'Solange', 'Cabrera', 'Moreno', '13981434', '7', '996317819', 'Lenguaje', 'fabinstructora35@gmail.com'),
(3, 'Erika', 'Marcela', 'Donoso', 'Arancibia', '13751619', '5', '977692341', 'Matemáticas', 'erikamdonoso@gmail.com'),
(4, 'Elwin', 'Alexis', 'Fernandez', 'Varas', '11944261', '3', '942457883', 'CS. Sociales', 'elwinfernandez.cach@gmail.com'),
(5, 'Gema', 'De Las Mercedes', 'Guzman', 'Rodriguez', '13351869', 'k', '981565478', 'Ingles', 'gemita24@gmail.com'),
(6, 'Maria', 'Victoria', 'Lizana', 'Quijanes', '17468364', '6', '933791121', 'Lenguaje', 'mlizanaquijanes@gmail.com'),
(7, 'Daniela', 'Alexandra', 'Moncada', 'Serey', '16305624', '0', '962790577', 'CS. Naturales', 'danielamoncadaserey23@gmail.com'),
(8, 'Viviana', 'Karina', 'Montenegro', 'Escobar', '15065403', '3', '993643381', 'Educadora', 'vivianamontenegro.cach@gmail.com'),
(9, 'Paula', 'Andrea', 'Muñoz', 'Milla', '17972195', '3', '944863629', 'Ingles', 'englishprofepau@gmail.com'),
(10, 'Javiera', 'Isidora', 'Muñoz', 'Villarroel', '19887868', '5', '988209314', 'Ed. Fisica', 'j28122012@gmail.com'),
(11, 'Maria', 'Paz', 'Navea', 'Reinoso', '17163932', '8', '953449607', 'Educadora', 'mariapaznavea.cach@gmail.com'),
(12, 'Juan', 'Francisco', 'Palacios', 'Bugueño', '18680585', '2', '964148933', 'Ed. Fisica', 'juanfraa.pb@gmail.com'),
(13, 'Marlenne', 'Tamara', 'Rodriguez', 'Banda', '18561960', '5', '981212560', 'Matemáticas', 'marlennerodriguez.cach@hotmail.com'),
(14, 'Valeria', 'Isabel', 'Toledo', 'Soto', '16951350', '3', '934331816', 'Educadora', 'valeriatoledo.cach@gmail.com'),
(15, 'Maria', 'Ines', 'Trigo', 'Ossandon', '8271586', 'k', '971019610', 'Matematicas', 'manetrigo@hotmail.com'),
(16, 'Ricxi', 'Andrea', 'Vasquez', 'Montenegro', '17468736', '6', '984269939', 'Lenguaje', 'ricxivm@gmail.com');

CREATE TABLE `region` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `region` (`id`, `nombre`) VALUES
(1, 'Arica y Parinacota'),
(2, 'Tarapacá'),
(3, 'Antofagasta'),
(4, 'Atacama'),
(5, 'Coquimbo'),
(6, 'Valparaíso'),
(7, 'Región del Libertador General Bernardo O’Higgins'),
(8, 'Región del Maule'),
(9, 'Región de Ñuble'),
(10, 'Región del Biobío'),
(11, 'Región de La Araucanía'),
(12, 'Región de Los Ríos'),
(13, 'Región de Los Lagos'),
(14, 'Región de Aysén del General Carlos Ibáñez del Campo'),
(15, 'Región de Magallanes y de la Antártica Chilena'),
(16, 'Región Metropolitana de Santiago');

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'ADMIN', 'Administrador del sistema'),
(2, 'APODERADO', 'Apoderado de un estudiante'),
(3, 'PROFESOR', 'Profesor del colegio');

CREATE TABLE `tipo_pago` (
  `id` int(11) NOT NULL,
  `detalle` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tipo_pago` (`id`, `detalle`) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta de Crédito'),
(3, 'Transferencia Bancaria'),
(4, 'Cheque');

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `apoderado_id` int(11) DEFAULT NULL,
  `profesor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuario_roles` (
  `usuario_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `apoderado`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `apoderado_direccion`
  ADD PRIMARY KEY (`apoderado_id`,`direccion_id`),
  ADD KEY `direccion_id` (`direccion_id`);

ALTER TABLE `apoderado_estudiante`
  ADD PRIMARY KEY (`apoderado_id`,`estudiante_id`),
  ADD KEY `estudiante_id` (`estudiante_id`);

ALTER TABLE `boleta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `apoderado_id` (`apoderado_id`),
  ADD KEY `pago_id` (`pago_id`),
  ADD KEY `estado_id` (`estado_id`);

ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`);

ALTER TABLE `curso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profesor_id` (`profesor_id`);

ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ciudad_id` (`ciudad_id`);

ALTER TABLE `estado_boleta`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `estudiante_curso`
  ADD PRIMARY KEY (`estudiante_id`,`curso_id`),
  ADD KEY `curso_id` (`curso_id`);

ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_pago_id` (`tipo_pago_id`);

ALTER TABLE `profesor`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `region`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `apoderado_id` (`apoderado_id`),
  ADD KEY `profesor_id` (`profesor_id`);

ALTER TABLE `usuario_roles`
  ADD PRIMARY KEY (`usuario_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);


ALTER TABLE `apoderado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `boleta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ciudad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `curso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `direccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `estado_boleta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `estudiante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `profesor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `region`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `tipo_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


ALTER TABLE `apoderado_direccion`
  ADD CONSTRAINT `apoderado_direccion_ibfk_1` FOREIGN KEY (`apoderado_id`) REFERENCES `apoderado` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `apoderado_direccion_ibfk_2` FOREIGN KEY (`direccion_id`) REFERENCES `direccion` (`id`) ON DELETE CASCADE;

ALTER TABLE `apoderado_estudiante`
  ADD CONSTRAINT `apoderado_estudiante_ibfk_1` FOREIGN KEY (`apoderado_id`) REFERENCES `apoderado` (`id`),
  ADD CONSTRAINT `apoderado_estudiante_ibfk_2` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`);

ALTER TABLE `boleta`
  ADD CONSTRAINT `boleta_ibfk_1` FOREIGN KEY (`apoderado_id`) REFERENCES `apoderado` (`id`),
  ADD CONSTRAINT `boleta_ibfk_2` FOREIGN KEY (`pago_id`) REFERENCES `pago` (`id`),
  ADD CONSTRAINT `boleta_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `estado_boleta` (`id`);

ALTER TABLE `ciudad`
  ADD CONSTRAINT `ciudad_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`) ON DELETE CASCADE;

ALTER TABLE `curso`
  ADD CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`profesor_id`) REFERENCES `profesor` (`id`);

ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudad` (`id`) ON DELETE CASCADE;

ALTER TABLE `estudiante_curso`
  ADD CONSTRAINT `estudiante_curso_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`),
  ADD CONSTRAINT `estudiante_curso_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`);

ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`tipo_pago_id`) REFERENCES `tipo_pago` (`id`);

ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`apoderado_id`) REFERENCES `apoderado` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`profesor_id`) REFERENCES `profesor` (`id`) ON DELETE SET NULL;

ALTER TABLE `usuario_roles`
  ADD CONSTRAINT `usuario_roles_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `usuario_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

