import { Injectable} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { BookService } from 'src/book/book.service';
import * as XLSX from 'xlsx';

@Injectable()
export class AdminService {
    constructor(
        private readonly bookService: BookService,
        private readonly authService: AuthService
    ) {}

    async downloadBookAsSheets() {
        const allBooksInDatabase = await this.bookService.allBooks();
        const worksheetData = allBooksInDatabase.map((book) => {
            name: book.name;
            description: book.description;
            createdYear: book.createdYear;
            pages: book.pages;
            isAvaiable: book.isAvaible;
            isBorrowed: book.isBorrowed;
            isReturned: book.isReturned;
            serialNumber: book.serialNumber;
        });
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Books');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return buffer;
    }

    async downloadStudentsAsSheets() {
        const allStudents = await this.authService.findAllStudents();
        const worksheetData = allStudents.map((student) => {
            name: student.name;
            lastName: student.lastName;
            email: student.email;
            // TODO: borrowed books
        })

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return buffer;
    }

    async downloadTeacherAsSheets() {}

    async downloadBookingAsSheets() {}
}
