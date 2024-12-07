import { MigrationInterface, QueryRunner } from 'typeorm';

export class Custom1733563418956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                create table if not exists category
                (
                    id   int auto_increment
                        primary key,
                    name varchar(255) not null,
                    constraint id
                        unique (id),
                    constraint name
                        unique (name)
                );
            `);

    await queryRunner.query(`
                create table if not exists book_info
                (
                    id          int auto_increment
                        primary key,
                    title       varchar(255)                             not null,
                    author      varchar(255)                             not null,
                    publisher   varchar(255)                             not null,
                    isbn        varchar(255)                             null,
                    image       varchar(255)                             null,
                    publishedAt date                                     null,
                    createdAt   datetime(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
                    categoryId  int                                      not null,
                    constraint book_info_ibfk_1
                        foreign key (categoryId) references category (id)
                );
            `);

    await queryRunner.query(`
                create index categoryId
                    on book_info (categoryId);
            `);

    await queryRunner.query(`
                create table if not exists book_info_search_keywords
                (
                    id                     int auto_increment
                        primary key,
                    book_info_id           int          null,
                    disassembled_title     varchar(255) null,
                    title_initials         varchar(255) null,
                    disassembled_author    varchar(255) null,
                    author_initials        varchar(255) null,
                    disassembled_publisher varchar(255) null,
                    publisher_initials     varchar(255) null,
                    constraint book_info_search_keywords_ibfk_1
                        foreign key (book_info_id) references book_info (id)
                );
            `);

    await queryRunner.query(`
                create index book_info_id
                    on book_info_search_keywords (book_info_id);
            `);

    await queryRunner.query(`
                create fulltext index fx_disassembled
                    on book_info_search_keywords (disassembled_title, disassembled_author, disassembled_publisher);
            `);

    await queryRunner.query(`
                create fulltext index fx_initials
                    on book_info_search_keywords (title_initials, author_initials, publisher_initials);
            `);

    await queryRunner.query(`
                create table if not exists migrations
                (
                    id     int auto_increment
                        primary key,
                    name   varchar(255) not null,
                    run_on datetime     not null
                );
            `);

    await queryRunner.query(`
                create table if not exists search_keywords
                (
                    id                   int auto_increment
                        primary key,
                    keyword              varchar(255) null,
                    disassembled_keyword varchar(255) null,
                    initial_consonants   varchar(255) null
                );
            `);

    await queryRunner.query(`
                create fulltext index fx_search_keywords
                    on search_keywords (disassembled_keyword, initial_consonants);
            `);

    await queryRunner.query(`
                create table if not exists search_logs
                (
                    id                int auto_increment
                        primary key,
                    search_keyword_id int                                 null,
                    timestamp         timestamp default CURRENT_TIMESTAMP not null,
                    constraint search_logs_ibfk_1
                        foreign key (search_keyword_id) references search_keywords (id)
                );
            `);

    await queryRunner.query(`
                create index search_keyword_id
                    on search_logs (search_keyword_id);
            `);

    await queryRunner.query(`
                create table if not exists user
                (
                    id             int auto_increment
                        primary key,
                    email          varchar(255) collate utf8mb4_bin         not null,
                    password       varchar(255)                             not null,
                    nickname       varchar(255)                             null,
                    intraId        int                                      null,
                    slack          varchar(255)                             null,
                    penaltyEndDate datetime    default CURRENT_TIMESTAMP    not null,
                    role           tinyint     default 0                    not null,
                    createdAt      datetime(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt      datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
                    constraint email
                        unique (email),
                    constraint intraId
                        unique (intraId),
                    constraint slack
                        unique (slack)
                );
            `);

    await queryRunner.query(`
                create table if not exists book
                (
                    id        int auto_increment
                        primary key,
                    donator   varchar(255)                             null,
                    callSign  varchar(255) collate utf8mb4_bin         not null,
                    status    int                                      not null,
                    createdAt datetime(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
                    infoId    int                                      not null,
                    donatorId int                                      null,
                    constraint FK_493671e9872dfd0ec4b35c628a2
                        foreign key (infoId) references book_info (id),
                    constraint FK_donator_id_from_user
                        foreign key (donatorId) references user (id)
                );
            `);

    await queryRunner.query(`
                create table if not exists lending
                (
                    id                   int auto_increment
                        primary key,
                    lendingLibrarianId   int                                       not null,
                    lendingCondition     varchar(255) default ''                   not null,
                    returningLibrarianId int                                       null,
                    returningCondition   varchar(255)                              null,
                    returnedAt           datetime(6)                               null,
                    createdAt            timestamp(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt            timestamp(6) default CURRENT_TIMESTAMP(6) not null,
                    userId               int                                       not null,
                    bookId               int                                       not null,
                    constraint FK_8d7c4d268c930cc5375772f5d87
                        foreign key (bookId) references book (id),
                    constraint FK_a8128ea55eede64ab4cf5a39fd2
                        foreign key (userId) references user (id),
                    constraint FK_f2adde8c7d298210c39c500d966
                        foreign key (lendingLibrarianId) references user (id),
                    constraint FK_returningLibrarianId
                        foreign key (returningLibrarianId) references user (id)
                );
            `);

    await queryRunner.query(`
                create table if not exists likes
                (
                    id         int auto_increment
                        primary key,
                    userId     int                  not null,
                    bookInfoId int                  not null,
                    isDeleted  tinyint(1) default 0 not null,
                    constraint FK_529dceb01ef681127fef04d755d4
                        foreign key (userId) references user (id),
                    constraint FK_bookInfo3
                        foreign key (bookInfoId) references book_info (id)
                );
            `);

    await queryRunner.query(`
                create table if not exists reservation
                (
                    id         int auto_increment
                        primary key,
                    endAt      datetime                                 null,
                    createdAt  datetime(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt  datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
                    status     int         default 0                    not null,
                    userId     int                                      not null,
                    bookId     int                                      null,
                    bookInfoId int                                      not null,
                    constraint FK_529dceb01ef681127fef04d755d
                        foreign key (userId) references user (id),
                    constraint FK_bookInfo
                        foreign key (bookInfoId) references book_info (id),
                    constraint FK_c82001439df87b04c529f301f6e
                        foreign key (bookId) references book (id)
                );
            `);

    await queryRunner.query(`
                create table if not exists reviews
                (
                    id             int auto_increment
                        primary key,
                    userId         int                                      not null,
                    bookInfoId     int                                      not null,
                    createdAt      datetime(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt      datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
                    updateUserId   int                                      not null,
                    isDeleted      tinyint(1)  default 0                    not null,
                    deleteUserId   int                                      null,
                    content        text                                     not null,
                    disabled       tinyint(1)  default 0                    not null,
                    disabledUserId int                                      null,
                    constraint FK_529dceb01ef681127fef04d755d3
                        foreign key (userId) references user (id),
                    constraint FK_bookInfo2
                        foreign key (bookInfoId) references book_info (id)
                );
            `);

    await queryRunner.query(`
                create table if not exists super_tag
                (
                    id           int auto_increment
                        primary key,
                    userId       int                                      not null,
                    bookInfoId   int                                      not null,
                    createdAt    datetime(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt    datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
                    isDeleted    tinyint     default 0                    not null,
                    updateUserId int                                      not null,
                    content      varchar(42)                              not null,
                    constraint super_tag_ibfk_1
                        foreign key (userId) references user (id),
                    constraint super_tag_ibfk_2
                        foreign key (bookInfoId) references book_info (id)
                );
            `);

    await queryRunner.query(`
                create index bookInfoId
                    on super_tag (bookInfoId);
            `);

    await queryRunner.query(`
                create index userid
                    on super_tag (userId);
            `);

    await queryRunner.query(`
                create table if not exists sub_tag
                (
                    id           int auto_increment
                        primary key,
                    userId       int                                      not null,
                    superTagId   int                                      not null,
                    createdAt    datetime(6) default CURRENT_TIMESTAMP(6) not null,
                    updatedAt    datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
                    isDeleted    tinyint     default 0                    not null,
                    updateUserId int                                      not null,
                    content      varchar(42)                              not null,
                    isPublic     tinyint     default 1                    not null,
                    constraint sub_tag_ibfk_1
                        foreign key (userId) references user (id),
                    constraint sub_tag_ibfk_2
                        foreign key (superTagId) references super_tag (id)
                );
            `);

    await queryRunner.query(`
                create index superTagId
                    on sub_tag (superTagId);
            `);

    await queryRunner.query(`
                create index userid
                    on sub_tag (userId);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 제거 순서는 FK 제약을 고려해 역순으로 진행합니다.
    await queryRunner.query(`drop index userid on sub_tag;`);
    await queryRunner.query(`drop index superTagId on sub_tag;`);
    await queryRunner.query(`drop table if exists sub_tag;`);

    await queryRunner.query(`drop index userid on super_tag;`);
    await queryRunner.query(`drop index bookInfoId on super_tag;`);
    await queryRunner.query(`drop table if exists super_tag;`);

    await queryRunner.query(`drop table if exists reviews;`);
    await queryRunner.query(`drop table if exists reservation;`);
    await queryRunner.query(`drop table if exists likes;`);
    await queryRunner.query(`drop table if exists lending;`);
    await queryRunner.query(`drop table if exists book;`);
    await queryRunner.query(`drop table if exists user;`);

    await queryRunner.query(`drop index search_keyword_id on search_logs;`);
    await queryRunner.query(`drop table if exists search_logs;`);

    // fulltext 인덱스 삭제
    // (MySQL/MariaDB 특정: fulltext 인덱스는 table drop 시 함께 제거되나, 필요시 명시적으로 drop 가능)
    await queryRunner.query(`drop table if exists search_keywords;`);

    await queryRunner.query(`drop table if exists migrations;`);

    // book_info_search_keywords 인덱스 및 테이블 제거
    await queryRunner.query(`drop table if exists book_info_search_keywords;`);

    await queryRunner.query(`drop index categoryId on book_info;`);
    await queryRunner.query(`drop table if exists book_info;`);

    await queryRunner.query(`drop table if exists category;`);
  }
}
