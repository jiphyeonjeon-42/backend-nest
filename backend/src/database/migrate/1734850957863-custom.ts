import { MigrationInterface, QueryRunner } from 'typeorm';

export class Custom1734850957863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS migrations`);
    await queryRunner.query(`DROP TABLE IF EXISTS sub_tag`);
    await queryRunner.query(`DROP TABLE IF EXISTS super_tag`);
    await queryRunner.query(`DROP VIEW IF EXISTS user_reservation`);
    await queryRunner.query(`DROP VIEW IF EXISTS v_histories`);
    await queryRunner.query(`DROP VIEW IF EXISTS v_lending`);
    await queryRunner.query(`DROP VIEW IF EXISTS v_lending_for_search_user`);
    await queryRunner.query(`DROP VIEW IF EXISTS v_search_book`);
    await queryRunner.query(`DROP VIEW IF EXISTS v_user_lending`);
    await queryRunner.query(`DROP VIEW IF EXISTS v_stock`);
    await queryRunner.query(`DROP VIEW IF EXISTS v_tags_sub_default`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
