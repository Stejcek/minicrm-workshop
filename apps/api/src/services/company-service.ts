import { companyInputSchema } from "@minicrm/shared";

import { AppError } from "../errors.js";
import type { CompanyRepository } from "../repositories/company-repository.js";

export class CompanyService {
  constructor(private readonly companies: CompanyRepository) {}

  list() {
    return this.companies.list();
  }

  async get(id: string) {
    const company = await this.companies.findById(id);
    if (!company) throw new AppError("Firma nebyla nalezena.", 404);
    return company;
  }

  create(input: unknown) {
    return this.companies.create(companyInputSchema.parse(input));
  }

  async update(id: string, input: unknown) {
    await this.get(id);
    return this.companies.update(id, companyInputSchema.parse(input));
  }

  async remove(id: string) {
    await this.get(id);
    if ((await this.companies.countContacts(id)) > 0) {
      throw new AppError("Firmu s přiřazenými kontakty nelze odstranit.", 409);
    }
    await this.companies.remove(id);
  }
}
