import { Column, CreatedAt, Model, Table } from "sequelize-typescript";

@Table
export class CpuMetrics extends Model {
  @Column
  computerId!: string;

  @Column
  name!: string;

  @Column
  performance!: string;

  static deviceType = "cpu";

  @CreatedAt
  createdAt!: Date;
}

@Table
export class RamMetrics extends Model {
  @Column
  computerId!: string;

  @Column
  name!: string;

  @Column
  performance!: string;

  static deviceType = "ram";

  @CreatedAt
  createdAt!: Date;
}

@Table
export class DiskMetrics extends Model {
  @Column
  computerId!: string;

  @Column
  name!: string;

  @Column
  performance!: string;

  static deviceType = "ram";

  @CreatedAt
  createdAt!: Date;
}

@Table
export class IncomingRequestLog extends Model {
  @Column
  payload!: string;

  @CreatedAt
  createdAt!: Date;
}


@Table
export class Users extends Model {
  @Column
  operation!: string;

  @Column
  payload!: string;

  @CreatedAt
  createdAt!: Date;
}
