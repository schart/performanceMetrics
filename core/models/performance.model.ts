import {
  Table,
  Column,
  Model,
  CreatedAt,
  PrimaryKey,
} from "sequelize-typescript";

@Table
export class PerformanceMetric extends Model {
  @Column
  computerId!: string;

  @Column
  cpu!: string;

  @Column
  ram!: string;

  @Column
  disk!: string;

  @CreatedAt
  createdAt!: Date;
}
//
