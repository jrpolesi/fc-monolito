import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./store-catalog.facade.interface";

export interface UseCasesProps {
  findUseCase: UseCaseInterface;
  findAllUseCase: UseCaseInterface;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUseCase: UseCaseInterface;
  private _findAllUseCase: UseCaseInterface;

  constructor(useCasesProps: UseCasesProps) {
    this._findUseCase = useCasesProps.findUseCase;
    this._findAllUseCase = useCasesProps.findAllUseCase;
  }
  async find(
    id: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    const product = await this._findUseCase.execute(id);
    return product;
  }
  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    const products = await this._findAllUseCase.execute();
    return products;
  }
}
