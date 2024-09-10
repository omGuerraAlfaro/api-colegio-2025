CREATE TABLE `noticias_colegio` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `src` VARCHAR(255) NOT NULL,
    `fecha` DATE NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `likes_count` INT DEFAULT 0
);

CREATE TABLE `noticias_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `image_data` MEDIUMBLOB NOT NULL,
    `noticiaId` INT,
    FOREIGN KEY (`noticiaId`) REFERENCES `noticias_colegio`(`id`) ON DELETE CASCADE
);

-- Opcional: índice para mejorar el rendimiento de las consultas relacionadas con noticiaId
CREATE INDEX `idx_noticiaId` ON `noticias_images`(`noticiaId`);



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

CREATE TABLE `curso` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nivel_grado` varchar(50) DEFAULT NULL,
  `profesor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `direccion` (
  `id` int(11) NOT NULL,
  `calle` varchar(255) NOT NULL,
  `numero` varchar(50) NOT NULL,
  `departamento` varchar(50) DEFAULT NULL,
  `codigo_postal` varchar(50) DEFAULT NULL,
  `ciudad_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `estado_boleta` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `region` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tipo_pago` (
  `id` int(11) NOT NULL,
  `detalle` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `apoderado_id` int(11) DEFAULT NULL,
  `profesor_id` int(11) DEFAULT NULL,
  `rut` varchar(255) DEFAULT NULL
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `boleta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ciudad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `curso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `direccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `estado_boleta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `estudiante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `profesor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `region`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `tipo_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


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