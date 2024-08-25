import { Resolver, Mutation } from '@nestjs/graphql';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
    constructor(private readonly adminService: AdminService) {}

    @Mutation(() => String)
    async downloadBookAsSheets(): Promise<string> {
        const buffer = await this.adminService.downloadBookAsSheets();
        return buffer.toString('base64');
    }

    @Mutation(() => String)
    async downloadStudentsAsSheets(): Promise<string> {
        const buffer = await this.adminService.downloadStudentsAsSheets();
        return buffer.toString('base64');
    }

    @Mutation(() => String)
    async downloadTeacherAsSheets(): Promise<string> {
        const buffer = await this.adminService.downloadTeacherAsSheets();
        return buffer.toString('base64');
    }

    @Mutation(() => String)
    async downloadBookingAsSheets(): Promise<string> {
        const buffer = await this.adminService.downloadBookingAsSheets();
        return buffer.toString('base64');
    }
}