import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737615629139 implements MigrationInterface {
    name = 'Migrations1737615629139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "syskey"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "syskey" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    }

}
