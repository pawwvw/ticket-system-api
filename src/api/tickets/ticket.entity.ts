import { Ticket, TicketStatus } from "@prisma/client";
import { BadRequestError } from "../../core/errors/bad-request-error";
import { ForbiddenOperationError } from "../../core/errors/forbidden-operation-error";

interface ITicketProps {
  id?: number;
  subject: string;
  text: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  solutionText?: string | null;
  cancellationReason?: string | null;
}

export class TicketEntity {
  readonly id?: number;
  subject: string;
  text: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  solutionText?: string | null;
  cancellationReason?: string | null;

  private constructor(props: ITicketProps) {
    this.id = props.id;
    this.subject = props.subject;
    this.text = props.text;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.solutionText = props.solutionText;
    this.cancellationReason = props.cancellationReason;
  }

  public static create(subject: string, text: string): TicketEntity {
    if (!subject || subject.trim() === "") {
      throw new BadRequestError("Тема обращения не может быть пустой.");
    }
    if (!text || text.trim() === "") {
      throw new BadRequestError("Текст обращения не может быть пустым.");
    }
    const props: ITicketProps = {
      subject,
      text,
      status: TicketStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return new TicketEntity(props);
  }

  public static fromPersistence(prismaTicket: Ticket): TicketEntity {
    return new TicketEntity({
      id: prismaTicket.id,
      subject: prismaTicket.subject,
      text: prismaTicket.text,
      status: prismaTicket.status,
      createdAt: prismaTicket.createdAt,
      updatedAt: prismaTicket.updatedAt,
      solutionText: prismaTicket.solutionText,
      cancellationReason: prismaTicket.cancellationReason,
    });
  }

  public markInProgress(): void {
    if (this.status !== TicketStatus.NEW) {
      throw new ForbiddenOperationError(
        `Нельзя взять в работу обращение со статусом "${this.status}". Ожидался статус "${TicketStatus.NEW}".`
      );
    }
    this.status = TicketStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  public complete(solutionText?: string | null): void {
    if (this.status !== TicketStatus.IN_PROGRESS) {
      throw new ForbiddenOperationError(
        `Нельзя выполнить обращение со статусом "${this.status}". Ожидался статус "${TicketStatus.IN_PROGRESS}".`
      );
    }
    this.status = TicketStatus.COMPLETED;
    this.solutionText = solutionText ? solutionText.trim() : null;
    this.updatedAt = new Date();
  }

  public cancel(cancellationReason?: string | null): void {
    if (this.status !== TicketStatus.IN_PROGRESS) {
      throw new ForbiddenOperationError(
        `Нельзя отменить обращение со статусом "${this.status}". Ожидался статус "${TicketStatus.IN_PROGRESS}".`
      );
    }
    this.status = TicketStatus.CANCELLED;
    this.cancellationReason = cancellationReason
      ? cancellationReason.trim()
      : null;
    this.updatedAt = new Date();
  }
}
