import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(isArchived: boolean) {
    return this.prisma.notes.findMany({
      where: { isArchived },
      orderBy: { createdAt: 'desc' },
      include: {
        note_categories: {
          include: { categories: true },
        },
      },
    });
  }

  findById(id: string) {
    return this.prisma.notes.findUnique({
      where: { id },
      include: {
        note_categories: {
          include: { categories: true },
        },
      },
    });
  }

  findByCategory(categoryId: string) {
    return this.prisma.notes.findMany({
      where: {
        isArchived: false,
        note_categories: { some: { categoryId } },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        note_categories: {
          include: { categories: true },
        },
      },
    });
  }

  create(data: CreateNoteDto) {
    return this.prisma.notes.create({
      data: { ...data, updatedAt: new Date() },
      include: {
        note_categories: {
          include: { categories: true },
        },
      },
    });
  }

  update(id: string, data: UpdateNoteDto) {
    return this.prisma.notes.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: {
        note_categories: {
          include: { categories: true },
        },
      },
    });
  }

  delete(id: string) {
    return this.prisma.notes.delete({ where: { id } });
  }

  updateArchiveStatus(id: string, isArchived: boolean) {
    return this.prisma.notes.update({
      where: { id },
      data: { isArchived, updatedAt: new Date() },
    });
  }
}
