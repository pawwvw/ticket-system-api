import { Router } from "express";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { validationMiddleware } from "../../core/middleware/validation.middleware";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { FilterTicketsDto } from "./dto/filter-tickets.dto";
import { CompleteTicketDto } from "./dto/complete-ticket.dto";
import { CancelTicketDto } from "./dto/cancel-ticket.dto";

const ticketService = new TicketService();
const ticketController = new TicketController(ticketService);

const router = Router();

router.post(
  "/",
  validationMiddleware(CreateTicketDto, "body"),
  (req, res, next) => {
    ticketController.createTicket(req, res, next);
  }
);

router.get(
  "/",
  validationMiddleware(FilterTicketsDto, "query"),
  (req, res, next) => {
    ticketController.getAllTickets(req, res, next);
  }
);

router.put("/:id/in-progress", (req, res, next) => {
  ticketController.takeTicketInProgress(req, res, next);
});

router.put(
  "/:id/complete",
  validationMiddleware(CompleteTicketDto, "body"),
  (req, res, next) => {
    ticketController.completeTicket(req, res, next);
  }
);

router.put(
  "/:id/cancel",
  validationMiddleware(CancelTicketDto, "body"),
  (req, res, next) => {
    ticketController.cancelTicket(req, res, next);
  }
);

router.put("/cancel-in-progress", (req, res, next) => {
  ticketController.cancelAllTicketInProgress(req, res, next);
});

export default router;
