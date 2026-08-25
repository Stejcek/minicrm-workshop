import type { Prisma, PrismaClient } from "@prisma/client";
import type { ActivityInput, ContactInput, ContactQuery } from "@minicrm/shared";

const companySummary = { select: { id: true, name: true } } as const;

export class ContactRepository {
  constructor(private readonly prisma: PrismaClient) {}

  list(query: ContactQuery) {
    const where: Prisma.ContactWhereInput = {};

    if (query.q) {
      where.OR = [
        { firstName: { contains: query.q } },
        { lastName: { contains: query.q } },
        { email: { contains: query.q } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.companyId) where.companyId = query.companyId;

    return this.prisma.contact.findMany({
      where,
      include: { company: companySummary },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });
  }

  findById(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
      include: {
        company: companySummary,
        activities: { orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }] },
      },
    });
  }

  create(input: ContactInput) {
    return this.prisma.contact.create({
      data: {
        ...input,
        nextContactAt: input.nextContactAt ? new Date(input.nextContactAt) : null,
      },
      include: { company: companySummary },
    });
  }

  update(id: string, input: ContactInput) {
    return this.prisma.contact.update({
      where: { id },
      data: {
        ...input,
        nextContactAt: input.nextContactAt ? new Date(input.nextContactAt) : null,
      },
      include: { company: companySummary },
    });
  }

  remove(id: string) {
    return this.prisma.contact.delete({ where: { id } });
  }

  addActivity(contactId: string, input: ActivityInput) {
    return this.prisma.activity.create({
      data: {
        contactId,
        type: input.type,
        text: input.text,
        occurredAt: new Date(input.occurredAt),
      },
    });
  }

  async dashboard() {
    const [total, newCount, qualified, won, upcoming] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.contact.count({ where: { status: "NEW" } }),
      this.prisma.contact.count({ where: { status: "QUALIFIED" } }),
      this.prisma.contact.count({ where: { status: "WON" } }),
      this.prisma.contact.findMany({
        where: { nextContactAt: { gte: new Date() } },
        include: { company: companySummary },
        orderBy: { nextContactAt: "asc" },
        take: 5,
      }),
    ]);

    return { counts: { total, new: newCount, qualified, won }, upcoming };
  }
}
