import { NextFunction, Request, Response } from "express";
import { TicketService } from "./ticket.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { BadRequestError } from "../../core/errors/bad-request-error";
import { CompleteTicketDto } from "./dto/complete-ticket.dto";
import { CancelTicketDto } from "./dto/cancel-ticket.dto";
import { FilterTicketsDto } from "./dto/filter-tickets.dto";

export class TicketController {
  constructor(private ticketService: TicketService) {}
  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const createTicketDto = req.body as CreateTicketDto;
      const newTicket = await this.ticketService.createTicket(createTicketDto);
      res.status(201).json(newTicket);
    } catch (error) {
      next(error);
    }
  }

  async takeTicketInProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new BadRequestError("ID должно быть числом");
      }
      const updatedTicket = await this.ticketService.takeTicketInProgress(id);
      res.status(200).json(updatedTicket);
    } catch (error) {
      next(error);
    }
  }

  async completeTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new BadRequestError("ID должно быть числом");
      }
      const completeTicketDto = req.body as CompleteTicketDto;
      const updatedTicket = await this.ticketService.completeTicket(
        id,
        completeTicketDto
      );
      res.status(200).json(updatedTicket);
    } catch (error) {
      next(error);
    }
  }

  async cancelTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new BadRequestError("ID должно быть числом");
      }
      const cancelTicketDto = req.body as CancelTicketDto;
      const updateTicket = await this.ticketService.cancelTicket(
        id,
        cancelTicketDto
      );
      res.status(200).json(updateTicket);
    } catch (error) {
      next(error);
    }
  }

  async cancelAllTicketInProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cancellationReason = req.body.cancellationReason as
        | string
        | undefined;
      const result = await this.ticketService.cancelAllTicketInProgress(
        cancellationReason
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const filterTicketsDto = req.query as FilterTicketsDto;
      const tickets = await this.ticketService.getAllTickets(filterTicketsDto);
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }
}
