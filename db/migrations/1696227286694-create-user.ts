import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1696227286694 implements MigrationInterface {
  name = 'CreateUser1696227286694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sessions\` (\`session_id\` char(36) NOT NULL, \`user_id\` int NOT NULL, \`refresh_token\` varchar(255) NOT NULL, \`user_agent\` varchar(255) NOT NULL, \`client_ip\` varchar(255) NOT NULL, \`is_blocked\` tinyint(1) NOT NULL DEFAULT 0, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(), INDEX \`user_id\` (\`user_id\`), PRIMARY KEY (\`session_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(50) NOT NULL, \`hashed_password\` varchar(255) NOT NULL, \`salt\` varchar(255) NOT NULL, \`nickname\` varchar(50) NOT NULL, \`gender\` enum ('M', 'W') NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`nickname\` (\`nickname\`), UNIQUE INDEX \`email\` (\`email\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_ad02a1be8707004cb805a4b502\` (\`nickname\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_085d540d9f418cfbdc7bd55bb19\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_085d540d9f418cfbdc7bd55bb19\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ad02a1be8707004cb805a4b502\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`nickname\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP INDEX \`user_id\` ON \`sessions\``);
    await queryRunner.query(`DROP TABLE \`sessions\``);
  }
}
