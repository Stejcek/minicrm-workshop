import type { PrismaClient } from "@prisma/client";
import type { CompanyInput } from "@minicrm/shared";

export class CompanyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  list() {
    return this.prisma.company.findMany({
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: "asc" },
    });
  }

  findById(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          include: { company: { select: { id: true, name: true } } },
          orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        },
      },
    });
  }

  create(input: CompanyInput) {
    return this.prisma.company.create({ data: input });
  }

  update(id: string, input: CompanyInput) {
    return this.prisma.company.update({ where: { id }, data: input });
  }

  countContacts(id: string) {
    return this.prisma.contact.count({ where: { companyId: id } });
  }

  remove(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }
}
