import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice",
  document: "123456789",
  address: new Address("Rua 1", "123", "Casa", "São Paulo", "SP", "12345678"),
  items: [
    new InvoiceItem({
      id: new Id("1"),
      name: "Item 1",
      price: 1.5,
    }),
  ],
});

const MockRepository = () => ({
  save: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
});

describe("Find Invoice use case unit test", () => {
  it("should find an invoice", async () => {
    const mockRepository = MockRepository();
    const useCase = new FindInvoiceUseCase(mockRepository);

    const input = {
      id: "1",
    };

    const output = await useCase.execute(input);

    expect(output.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);
    expect(output.total).toBe(invoice.total());
    expect(output.createdAt).toBe(invoice.createdAt);

    expect(output.address.street).toBe(invoice.address.street);
    expect(output.address.number).toBe(invoice.address.number);
    expect(output.address.complement).toBe(invoice.address.complement);
    expect(output.address.city).toBe(invoice.address.city);
    expect(output.address.state).toBe(invoice.address.state);
    expect(output.address.zipCode).toBe(invoice.address.zipCode);

    expect(output.items.length).toBe(1);
    expect(output.items[0].id).toBe(invoice.items[0].id.id);
    expect(output.items[0].name).toBe(invoice.items[0].name);
    expect(output.items[0].price).toBe(invoice.items[0].price);
  });
});
