import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => Boolean)
  async deleteAllAuthors(): Promise<boolean> {
    await this.adminService.deleteAllAuthors();
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllPublishers(): Promise<boolean> {
    await this.adminService.deleteAllPublishers();
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllCategories(): Promise<boolean> {
    await this.adminService.deleteAllCategories();
    return true;
  }

  @Query(() => Boolean)
  async downloadBooksAsSheets(@Res() res: Response): Promise<void> {
    const buffer = await this.adminService.downloadBookAsSheets();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="books.xlsx"',
    });
    res.end(buffer);
  }

  @Query(() => Boolean)
  async downloadStudentsAsSheets(@Res() res: Response): Promise<void> {
    const buffer = await this.adminService.downloadStudentsAsSheets();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="students.xlsx"',
    });
    res.end(buffer);
  }

  @Query(() => Boolean)
  async downloadTeachersAsSheets(@Res() res: Response): Promise<void> {
    const buffer = await this.adminService.downloadTeacherAsSheets();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="teachers.xlsx"',
    });
    res.end(buffer);
  }

  @Query(() => Boolean)
  async downloadBookingsAsSheets(@Res() res: Response): Promise<void> {
    const buffer = await this.adminService.downloadBookingAsSheets();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="bookings.xlsx"',
    });
    res.end(buffer);
  }
}