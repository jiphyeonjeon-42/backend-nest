import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1734854602845 implements MigrationInterface {
  name = 'Auto1734854602845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`book_info_search_keywords\` DROP FOREIGN KEY \`book_info_search_keywords_ibfk_1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info\` DROP FOREIGN KEY \`book_info_ibfk_1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`search_logs\` DROP FOREIGN KEY \`search_logs_ibfk_1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`book_info_id\` ON \`book_info_search_keywords\``,
    );
    await queryRunner.query(
      `DROP INDEX \`fx_disassembled\` ON \`book_info_search_keywords\``,
    );
    await queryRunner.query(
      `DROP INDEX \`fx_initials\` ON \`book_info_search_keywords\``,
    );
    await queryRunner.query(`DROP INDEX \`categoryId\` ON \`book_info\``);
    await queryRunner.query(
      `DROP INDEX \`search_keyword_id\` ON \`search_logs\``,
    );
    await queryRunner.query(
      `DROP INDEX \`fx_search_keywords\` ON \`search_keywords\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lending\` CHANGE \`updatedAt\` \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info_search_keywords\` ADD UNIQUE INDEX \`IDX_759755c27994a9fcf0853bb4de\` (\`book_info_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\` (\`email\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_bb21f7478f422418fbd5362007\` ON \`user\` (\`intraId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_313d764c4d8f1fff52ac1ee967\` ON \`user\` (\`slack\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_759755c27994a9fcf0853bb4de\` ON \`book_info_search_keywords\` (\`book_info_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info_search_keywords\` ADD CONSTRAINT \`FK_759755c27994a9fcf0853bb4de5\` FOREIGN KEY (\`book_info_id\`) REFERENCES \`book_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info\` ADD CONSTRAINT \`FK_34aff905d470a4664465e823b11\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`search_logs\` ADD CONSTRAINT \`FK_f1f1e53d16b6fe52661dd4a1e2c\` FOREIGN KEY (\`search_keyword_id\`) REFERENCES \`search_keywords\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`search_logs\` DROP FOREIGN KEY \`FK_f1f1e53d16b6fe52661dd4a1e2c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info\` DROP FOREIGN KEY \`FK_34aff905d470a4664465e823b11\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info_search_keywords\` DROP FOREIGN KEY \`FK_759755c27994a9fcf0853bb4de5\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_759755c27994a9fcf0853bb4de\` ON \`book_info_search_keywords\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_313d764c4d8f1fff52ac1ee967\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bb21f7478f422418fbd5362007\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info_search_keywords\` DROP INDEX \`IDX_759755c27994a9fcf0853bb4de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lending\` CHANGE \`updatedAt\` \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `CREATE FULLTEXT INDEX \`fx_search_keywords\` ON \`search_keywords\` (\`disassembled_keyword\`, \`initial_consonants\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`search_keyword_id\` ON \`search_logs\` (\`search_keyword_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`categoryId\` ON \`book_info\` (\`categoryId\`)`,
    );
    await queryRunner.query(
      `CREATE FULLTEXT INDEX \`fx_initials\` ON \`book_info_search_keywords\` (\`title_initials\`, \`author_initials\`, \`publisher_initials\`)`,
    );
    await queryRunner.query(
      `CREATE FULLTEXT INDEX \`fx_disassembled\` ON \`book_info_search_keywords\` (\`disassembled_title\`, \`disassembled_author\`, \`disassembled_publisher\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`book_info_id\` ON \`book_info_search_keywords\` (\`book_info_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`search_logs\` ADD CONSTRAINT \`search_logs_ibfk_1\` FOREIGN KEY (\`search_keyword_id\`) REFERENCES \`search_keywords\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info\` ADD CONSTRAINT \`book_info_ibfk_1\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book_info_search_keywords\` ADD CONSTRAINT \`book_info_search_keywords_ibfk_1\` FOREIGN KEY (\`book_info_id\`) REFERENCES \`book_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
