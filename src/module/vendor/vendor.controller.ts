import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VendorSerivce } from './vendor.service';
import { VendorApi, VendorApiPath, VendorApiTags } from './vendor.constant';
import { CreateVendorBodyDto } from './dto/create-vendor-dto';
import { VendorCatalogBodyDto } from './dto/vendor-catalog';
import { RequestUser } from 'src/helper/decorator/user.decorator';
import { User } from '../user/interface/user';
import { vendorType } from './interface/vendor';

@ApiBearerAuth()
@ApiTags(VendorApiTags.API_TAG)
@Controller(VendorApi.CONTROLLER)
export class VendorController {
  constructor(private readonly vendorService: VendorSerivce) {}

  @Post(VendorApiPath.CREATE_VENDOR)
  async createVendor(
    @Body() createVendorBodyDto: CreateVendorBodyDto,
    @Headers('facility') facility: string,
    @RequestUser() user: User,
  ): Promise<vendorType> {
    return await this.vendorService.createVendor(
      createVendorBodyDto,
      facility,
      user,
    );
  }

  @Post(`${VendorApiPath.UPDATE_VENDOR}`)
  async updateVendor(
    @Body() createVendorBodyDto: CreateVendorBodyDto,
    @RequestUser() user: User,
  ): Promise<vendorType> {
    return await this.vendorService.updateVendor(createVendorBodyDto, user);
  }

  @Post(VendorApiPath.VENDOR_ITEM_TYPE_CREATE_OR_EDIT)
  async createVendorCatalog(
    @Body() vendorCatalogBodyDto: VendorCatalogBodyDto,
    @RequestUser() user: User,
  ): Promise<vendorType> {
    return await this.vendorService.createVendorCatalog(
      vendorCatalogBodyDto,
      user,
    );
  }
}
