import { activityInputSchema, contactInputSchema, contactQuerySchema } from "@minicrm/shared";
import type { PrismaClient } from "@prisma/client";

import { AppError } from "../errors.js";
import type { ContactRepository } from "../repositories/contact-repository.js";

export class ContactService {
  constructor(
    private readonly contacts: ContactRepository,
    private readonly prisma: PrismaClient,
  ) {}

  list(query: unknown) {
    return this.contacts.list(contactQuerySchema.parse(query));
  }

  async get(id: string) {
    const contact = await this.contacts.findById(id);
    if (!contact) throw new AppError("Kontakt nebyl nalezen.", 404);
    return contact;
  }

  async create(input: unknown) {
    const data = contactInputSchema.parse(input);
    await this.ensureCompanyExists(data.companyId);
    return this.contacts.create(data);
  }

  async update(id: string, input: unknown) {
    await this.get(id);
    const data = contactInputSchema.parse(input);
    await this.ensureCompanyExists(data.companyId);
    return this.contacts.update(id, data);
  }

  async remove(id: string) {
    await this.get(id);
    await this.contacts.remove(id);
  }

  async addActivity(contactId: string, input: unknown) {
    await this.get(contactId);
    return this.contacts.addActivity(contactId, activityInputSchema.parse(input));
  }

  dashboard() {
    return this.contacts.dashboard();
  }

  private async ensureCompanyExists(companyId: string | null | undefined) {
    if (!companyId) return;
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true },
    });
    if (!company) throw new AppError("Vybraná firma neexistuje.", 400);
  }
}
