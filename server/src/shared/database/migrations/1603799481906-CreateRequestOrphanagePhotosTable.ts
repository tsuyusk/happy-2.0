import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRequestOrphanagePhotosTable1603799481906
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'request_orphanages_photos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'filename',
            type: 'varchar',
          },
          {
            name: 'request_orphanage_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            name: 'RequestOrphanagePhotoOrphanage',
            columnNames: ['request_orphanage_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'request_orphanages',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('request_orphanages_photos');
  }
}
