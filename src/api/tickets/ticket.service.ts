import { Prisma, TicketStatus } from "@prisma/client";
import { NotFoundError } from "../../core/errors/not-found-error";
import prisma from "../../prisma-client";
import { CancelTicketDto } from "./dto/cancel-ticket.dto";
import { CompleteTicketDto } from "./dto/complete-ticket.dto";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { TicketEntity } from "./ticket.entity";
import { FilterTicketsDto } from "./dto/filter-tickets.dto";

export class TicketService {
  private async getTicketEntityById(id: number): Promise<TicketEntity> {
    const ticketData = await prisma.ticket.findUnique({ where: { id } });
    if (!ticketData) {
      throw new NotFoundError(`Обращение с ID ${id} не найдено.`);
    }
    return TicketEntity.fromPersistence(ticketData);
  }

  public async createTicket(
    createTicketDto: CreateTicketDto
  ): Promise<TicketEntity> {
    const ticketEntity = TicketEntity.create(
      createTicketDto.subject,
      createTicketDto.text
    );
    const savedTicketData = await prisma.ticket.create({
      data: {
        subject: ticketEntity.subject,
        text: ticketEntity.text,
        status: ticketEntity.status,
      },
    });
    return TicketEntity.fromPersistence(savedTicketData);
  }

  public async takeTicketInProgress(id: number): Promise<TicketEntity> {
    const ticketEntity = await this.getTicketEntityById(id);
    ticketEntity.markInProgress();
    const updatedTicketData = await prisma.ticket.update({
      where: { id },
      data: {
        status: ticketEntity.status,
      },
    });
    return TicketEntity.fromPersistence(updatedTicketData);
  }

  public async completeTicket(
    id: number,
    completeTicketDto: CompleteTicketDto
  ): Promise<TicketEntity> {
    const ticketEntity = await this.getTicketEntityById(id);
    ticketEntity.complete(completeTicketDto.solutionText);
    const updatesTicketData = await prisma.ticket.update({
      where: { id },
      data: {
        status: ticketEntity.status,
        solutionText: ticketEntity.solutionText,
      },
    });
    return TicketEntity.fromPersistence(updatesTicketData);
  }

  public async cancelTicket(
    id: number,
    cancelTicketDto: CancelTicketDto
  ): Promise<TicketEntity> {
    const ticketEntity = await this.getTicketEntityById(id);
    ticketEntity.cancel(cancelTicketDto.cancellationReason);
    const updateTicketData = await prisma.ticket.update({
      where: { id },
      data: {
        status: ticketEntity.status,
        cancellationReason: ticketEntity.cancellationReason,
      },
    });
    return TicketEntity.fromPersistence(updateTicketData);
  }

  public async cancelAllTicketInProgress(
    cancellationReason: string | undefined
  ): Promise<{ cancelledCount: number; ids: number[] }> {
    const ticketsToCancelQuery = await prisma.ticket.findMany({
      where: { status: TicketStatus.IN_PROGRESS },
      select: {
        id: true,
      },
    });
    const ticketsToCancelIds = ticketsToCancelQuery.map((ticket) => ticket.id);
    if (ticketsToCancelIds.length === 0) {
      return { cancelledCount: 0, ids: [] };
    }
    const updateTickets = await prisma.ticket.updateMany({
      where: {
        id: {
          in: ticketsToCancelIds,
        },
      },
      data: {
        status: TicketStatus.CANCELLED,
        cancellationReason: cancellationReason,
      },
    });

    return { cancelledCount: updateTickets.count, ids: ticketsToCancelIds };
  }

  public async getAllTickets(
    filterTicketsDto: FilterTicketsDto
  ): Promise<TicketEntity[]> {
    const where: Prisma.TicketWhereInput = {};

    if (filterTicketsDto.date) {
      const targetDate = new Date(filterTicketsDto.date);
      const gte = new Date(targetDate);
      gte.setUTCHours(0, 0, 0, 0);
      const lte = new Date(targetDate);
      lte.setUTCHours(23, 59, 59, 999);

      where.createdAt = {
        gte: gte,
        lte: lte,
      };
    } else {
      let createdAtConditions: Prisma.DateTimeFilter | undefined = undefined;

      if (filterTicketsDto.startDate) {
        if (!createdAtConditions) createdAtConditions = {};
        const startDate = new Date(filterTicketsDto.startDate);
        startDate.setUTCHours(0, 0, 0, 0);
        createdAtConditions.gte = startDate;
      }

      if (filterTicketsDto.endDate) {
        if (!createdAtConditions) createdAtConditions = {};
        const endDate = new Date(filterTicketsDto.endDate);
        endDate.setUTCHours(23, 59, 59, 999);
        createdAtConditions.lte = endDate;
      }

      if (createdAtConditions) {
        where.createdAt = createdAtConditions;
      }
    }

    const ticketsData = await prisma.ticket.findMany({
      where: where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return ticketsData.map((ticketData) =>
      TicketEntity.fromPersistence(ticketData)
    );
  }
}
