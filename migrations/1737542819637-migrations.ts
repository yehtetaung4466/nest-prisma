import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737542819637 implements MigrationInterface {
    name = 'Migrations1737542819637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" integer NOT NULL, "image" character varying(255), "syskey" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
