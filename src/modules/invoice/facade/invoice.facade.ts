import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCasesProps {
  generateInvoiceUseCase: UseCaseInterface;
  findInvoiceUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateInvoiceUseCase: UseCaseInterface;
  private _findInvoiceUseCase: UseCaseInterface;

  constructor(useCasesProps: UseCasesProps) {
    this._generateInvoiceUseCase = useCasesProps.generateInvoiceUseCase;
    this._findInvoiceUseCase = useCasesProps.findInvoiceUseCase;
  }

  async generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateInvoiceUseCase.execute(input);
  }

  async find(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return this._findInvoiceUseCase.execute(input);
  }
}
