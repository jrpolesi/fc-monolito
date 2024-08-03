import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
});

describe("Generate invoice use case unit test", () => {
  it("should generate an invoice", async () => {
    const mockRepository = MockRepository();
    const useCase = new GenerateInvoiceUseCase(mockRepository);

    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Rua 1",
      number: "123",
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 1.5,
        },
      ],
    };

    const output = await useCase.execute(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.total).toBe(1.5);

    expect(output.items.length).toBe(1);
    expect(output.items[0].id).toBe(input.items[0].id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
  });
});
