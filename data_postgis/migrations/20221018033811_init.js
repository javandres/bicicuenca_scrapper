/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  console.log("Applying postgis migration");
  await knex.raw(`
    CREATE EXTENSION IF NOT EXISTS postgis;

    CREATE EXTENSION IF NOT EXISTS timescaledb;

    CREATE EXTENSION IF NOT EXISTS hstore;
    
    CREATE TABLE IF NOT EXISTS public.bicicuenca_data (
      id serial,
      timestamp timestamptz,
      nombre varchar,
      ref varchar,
      lat varchar,
      lon varchar,
      direccion varchar,
      capacity int,
      und1 varchar,
      status1 varchar,
      status2 varchar,
      disponible1 int,
      disponible2 int,
      vacante int,
      tipo_estacion varchar,
      icono varchar

    );


    CREATE TABLE IF NOT EXISTS public.estaciones (
      fid int8 NOT NULL,
      geom public.geometry(point, 4326) NULL,
      osm_id varchar(254) NULL,
      "name" varchar(254) NULL,
      "ref" varchar(254) NULL,
      capacity int4 NULL,
      "actualiz." date NULL,
      auxiliary_storage_labeling_positionx float8 NULL,
      auxiliary_storage_labeling_positiony float8 NULL,
      name_web varchar NULL,
      CONSTRAINT estaciones_pkey PRIMARY KEY (fid)
    );

    CREATE INDEX sidx_estaciones_geom ON public.estaciones USING gist (geom);

    INSERT INTO public.estaciones (fid,geom,osm_id,"name","ref",capacity,"actualiz.",auxiliary_storage_labeling_positionx,auxiliary_storage_labeling_positiony,name_web) VALUES
	 (1,'SRID=4326;POINT (-79.0058534 -2.9020013)','6381441587','13. El Centenario','13',21,'2023-02-27',-79.00709719750394,-2.900014364462051,'El Centenario'),
	 (2,'SRID=4326;POINT (-79.0041223 -2.8982907)','6382041202','7. Parque Calderon','7',20,'2023-02-27',NULL,NULL,'Parque Calderón'),
	 (3,'SRID=4326;POINT (-79.0149789 -2.9017586)','6384025414','16. Escuela Panama','16',16,'2023-02-27',NULL,NULL,'Escuela Panamá'),
	 (4,'SRID=4326;POINT (-79.0113499 -2.8988962)','6384042195','14. El Farol','14',16,'2023-02-27',NULL,NULL,'El Farol'),
	 (5,'SRID=4326;POINT (-79.0037898 -2.901492)','6384700492','8. La Merced','8',16,'2023-02-27',-79.00275733974411,-2.900891552544985,'La Merced'),
	 (6,'SRID=4326;POINT (-79.0098581 -2.9021973)','6412749889','15. Universidad de Cuenca','15',20,'2023-02-27',-79.01035148285787,-2.900972308934957,'Universidad de Cuenca'),
	 (7,'SRID=4326;POINT (-79.0072465 -2.9073419)','6540828997','18. El Estadio','18',28,'2023-02-27',NULL,NULL,'El Estadio'),
	 (8,'SRID=4326;POINT (-79.0036397 -2.9053127)','6540828998','12. Parque de la Madre. John Jarrin Diaz.','12',20,'2023-02-27',NULL,NULL,'Parque de la Madre'),
	 (9,'SRID=4326;POINT (-79.0124433 -2.9048719)','6672747142','17. La Concordia','17',20,'2023-02-27',NULL,NULL,'La Concordia'),
	 (10,'SRID=4326;POINT (-78.9910608 -2.9114786)','6818620244','2. Parque de el Paraiso','2',14,'2023-02-27',NULL,NULL,'Parque de el paraíso');
    INSERT INTO public.estaciones (fid,geom,osm_id,"name","ref",capacity,"actualiz.",auxiliary_storage_labeling_positionx,auxiliary_storage_labeling_positiony,name_web) VALUES
	 (11,'SRID=4326;POINT (-78.9948706 -2.9102961)','6818620245','11. El Vergel','11',21,'2023-02-27',NULL,NULL,'El Vergel'),
	 (12,'SRID=4326;POINT (-79.0003026 -2.9177841)','7467900870','20. Universidad del Azuay','20',28,'2023-02-27',NULL,NULL,'Universidad del Azuay'),
	 (13,'SRID=4326;POINT (-78.992764 -2.892696)','7467900871','1. Terminal Terrestre','1',12,'2023-02-27',NULL,NULL,'Terminal Terrestre'),
	 (14,'SRID=4326;POINT (-79.000677 -2.8948542)','7467900872','3. Nueve de Octubre','3',20,'2023-02-27',NULL,NULL,'Nueve de Octubre'),
	 (15,'SRID=4326;POINT (-79.0059409 -2.8925596)','7467900873','4. Mari­a Auxiliadora','4',21,'2023-02-27',NULL,NULL,'María Auxiliadora'),
	 (16,'SRID=4326;POINT (-79.0055891 -2.8952152)','7467900874','5. Santo Domingo. Cristina Farez.','5',20,'2023-02-27',NULL,NULL,'Santo Domingo'),
	 (17,'SRID=4326;POINT (-79.0109246 -2.8955292)','7467900875','6. San Sebastian','6',21,'2023-02-27',NULL,NULL,'San Sebastián'),
	 (18,'SRID=4326;POINT (-79.00019878709385 -2.8998388612225154)','7467900876','9. Victor J. Cuesta','9',21,'2023-02-27',-79.00117993947168,-2.898226649351691,'Victor J. Cuesta'),
	 (19,'SRID=4326;POINT (-78.9967843 -2.898971)','7467900877','10. Portal Artesanal','10',20,'2023-02-27',NULL,NULL,'Portal Artesanal'),
	 (20,'SRID=4326;POINT (-79.0077624 -2.9099438)','6412779518','19. UE La Salle','19',20,'2023-02-27',NULL,NULL,'UE La Salle');


    CREATE OR REPLACE VIEW public.bicicuenca_data_estacion AS 
    SELECT q."timestamp",
    q.count,
    q.capacidad,
    q.bicis,
    q.anclajes,
    q.estaciones_inactiva,
    q.estaciones_activa,
    last_value(q.bicis) OVER (ORDER BY q."timestamp" RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS bicis_last,
    last_value(q.anclajes) OVER (ORDER BY q."timestamp" RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS anclajes_last
    FROM ( SELECT bd."timestamp",
            count(*) AS count,
            sum(bd.capacity) AS capacidad,
            sum(bd.disponible1) AS bicis,
            sum(bd.vacante) AS anclajes,
            count(1) FILTER (WHERE bd.status1::text = 'I'::text) AS estaciones_inactiva,
            count(1) FILTER (WHERE bd.status1::text = 'A'::text) AS estaciones_activa
           FROM bicicuenca_data bd
          GROUP BY bd."timestamp"
          ORDER BY bd."timestamp" DESC) q;


    CREATE OR REPLACE VIEW bicicuenca_data_geom as
    select 
      id, 
      "timestamp" , 
      nombre, 
      ref, 
      lat::numeric, 
      lon::numeric, 
      direccion, 
      capacity::numeric as capacidad, 
      status1  as status,
      status2 as status2,
      disponible1::numeric  as bicis,
      vacante::numeric as anclajes,
      ST_SetSRID(ST_MakePoint(lon::numeric , lat::numeric), 4326)  as geometry,
      st_asgeojson(  ST_SetSRID(ST_MakePoint(lon::numeric , lat::numeric), 4326) ) as geojson
    from bicicuenca_data;
    
    CREATE OR REPLACE VIEW bicicuenca_data_geom_hour as
    select row_number() OVER () AS id, a.bucket as timestamp, a.nombre, a.ref, a.capacidad, a.bicis, a.anclajes, ST_X(e.geom) as lon, ST_Y(e.geom) as lat,  e.geom
    from (
      select time_bucket(INTERVAL '1 hour', timestamp) AS "bucket", nombre, ref, max(capacidad) as capacidad, avg(bicis) as bicis, avg(anclajes) as anclajes 
      from bicicuenca_data_geom
      group by bucket, nombre, ref
    ) a, estaciones e
    where e.ref = a.ref
    order by timestamp


  `);
  console.log("PostGIS migration successfully!");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw("DROP table bicicuenca_data;");
};
