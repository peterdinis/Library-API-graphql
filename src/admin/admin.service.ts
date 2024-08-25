import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { BookService } from 'src/book/book.service';
import { BookingService } from 'src/booking/booking.service';
import * as XLSX from 'xlsx';

@Injectable()
export class AdminService {
    constructor(
        private readonly bookService: BookService,
        private readonly authService: AuthService,
        private readonly bookingService: BookingService
    ) {}

    async downloadBookAsSheets() {
        const allBooksInDatabase = await this.bookService.allBooks();
        const worksheetData = allBooksInDatabase.map((book) => ({
            name: book.name,
            description: book.description,
            createdYear: book.createdYear,
            pages: book.pages,
            isAvaiable: book.isAvaible,
            isBorrowed: book.isBorrowed,
            isReturned: book.isReturned,
            serialNumber: book.serialNumber,
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Books');

        const buffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
        });

        return buffer;
    }

    async downloadStudentsAsSheets() {
        const allStudents = await this.authService.findAllStudents();
        const worksheetData = allStudents.map((student) => ({
            name: student.name,
            lastName: student.lastName,
            email: student.email,
            borrowedBooks: student.borrowedBooks.map((item) => item.bookName).join(', '), // Joins book names with commas
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

        const buffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
        });

        return buffer;
    }

    async downloadTeacherAsSheets() {
        const allTeachers = await this.authService.findAllTeachers();
        const worksheetData = allTeachers.map((teacher) => ({
            name: teacher.name,
            lastName: teacher.lastName,
            email: teacher.email,
            borrowedBooks: teacher.borrowedBooks.map((item) => item.bookName).join(', '), // Joins book names with commas
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');

        const buffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
        });

        return buffer;
    }

    async downloadBookingAsSheets() {
        const allBookings = await this.bookingService.getAllBookings();
        const worksheetData = allBookings.map((item) => ({
            bookName: item.bookName,
            from: item.from,
            to: item.to,
            isReturned: item.isReturned,
            isExtended: item.isExtended,
            // TODO: Display user information here if needed
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

        const buffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xlsx',
        });

        return buffer;
    }
}