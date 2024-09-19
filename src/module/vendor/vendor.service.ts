import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVendorBodyDto } from './dto/create-vendor-dto';
import { ShippingAndBillingAddressDto } from './dto/address-dto';
import { VendorCatalogBodyDto } from './dto/vendor-catalog';
import { DATABASE_INSTANCE } from '../../config/database/database.constants';
import { UtilService } from '../util/util.service';
import { User } from '../user/interface/user';
import { Addresses } from './entity/addresses.entity';
import { Vendor } from './entity/vendor.entity';
import { Products } from '../products/entity/products.entity';
import { VendorCatalog } from './entity/vendor-catalog.entity';
import { vendorType } from './interface/vendor';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class VendorSerivce {
  constructor(
    private readonly utilService: UtilService,
    @InjectRepository(Vendor, DATABASE_INSTANCE.MASTER)
    private readonly vendorRepository,
    @InjectRepository(Addresses, DATABASE_INSTANCE.MASTER)
    private readonly addressRepository,
    @InjectRepository(Products, DATABASE_INSTANCE.MASTER)
    private readonly productRepository,
    @InjectRepository(VendorCatalog, DATABASE_INSTANCE.MASTER)
    private readonly catalogRepository,
  ) {}

  async createVendor(
    createVendorBodyDto: CreateVendorBodyDto,
    facility: string,
    user: User,
  ): Promise<vendorType> {
    const { shippingAddress, billingAddress } = createVendorBodyDto;
    let billingAddressId;
    const isExist = await this.vendorRepository.findOne({
      where: { code: createVendorBodyDto.code },
    });
    if (isExist) {
      throw new BadRequestException('Vendor already exists');
    }

    const shippingAddressId = this.storeVendorAddress(shippingAddress, user);
    // return this.addressRepository.create({
    //   addressLine1: shippingAndBillingAddressDto.addressLine1,
    //   addressLine2: shippingAndBillingAddressDto.addressLine2,
    //   countryCode: shippingAndBillingAddressDto.countryCode,
    //   pincode: shippingAndBillingAddressDto.pincode,
    //   stateCode: shippingAndBillingAddressDto.stateCode,
    //   city: shippingAndBillingAddressDto.city,
    //   phone: shippingAndBillingAddressDto.phone,
    //   created_by: user.id,
    //   updated_by: user.id,
    // });

    if (createVendorBodyDto.sameAsShipping) {
      billingAddressId = shippingAddressId;
    } else {
      billingAddressId = this.storeVendorAddress(billingAddress, user);
    }
    await this.insertIntoPoInBoundVendor(
      createVendorBodyDto,
      user,
      shippingAddressId,
      billingAddressId,
    );

    return {
      message: `vendor created successfully`,
    };
  }

  async insertIntoPoInBoundVendor(
    createVendorBodyDto: CreateVendorBodyDto,
    user: User,
    shippingAddressId: Addresses,
    billingAddressId: Addresses,
  ): Promise<void> {
    const vendor = new Vendor();

    vendor.contact_name = createVendorBodyDto?.partyContacts[0]?.name || null;
    vendor.email = createVendorBodyDto?.partyContacts[0]?.email || null;
    vendor.mobile = createVendorBodyDto?.partyContacts[0]?.phone || null;
    vendor.code = createVendorBodyDto.code;
    vendor.name = createVendorBodyDto.name;
    vendor.pan = createVendorBodyDto.pan || null;
    vendor.tin = createVendorBodyDto.tin || null;
    vendor.cstNumber = createVendorBodyDto.cstNumber || null;
    vendor.stNumber = createVendorBodyDto.stNumber || null;
    vendor.gstNumber = createVendorBodyDto.gstNumber || null;
    vendor.purchaseExpiryPeriod =
      createVendorBodyDto.purchaseExpiryPeriod || null;
    vendor.acceptsCForm = createVendorBodyDto.acceptsCForm || '1';
    vendor.taxExempted = createVendorBodyDto.taxExempted || '1';
    vendor.enabled = createVendorBodyDto.enabled || null;
    vendor.registeredDealer = createVendorBodyDto.registeredDealer || '1';
    vendor.created_by = user.id;
    vendor.updated_by = user.id;
    vendor.billingAddressId = billingAddressId.id;
    vendor.shippingAddressId = shippingAddressId.id;

    await this.vendorRepository.save(vendor);
  }

  storeVendorAddress(
    shippingAndBillingAddressDto: ShippingAndBillingAddressDto,
    user: User,
  ): Addresses {
    const address = new Addresses();

    address.addressLine1 = shippingAndBillingAddressDto.addressLine1;
    address.addressLine2 = shippingAndBillingAddressDto.addressLine2 || null;
    address.countryCode = shippingAndBillingAddressDto.countryCode;
    address.pincode = shippingAndBillingAddressDto.pincode;
    address.stateCode = shippingAndBillingAddressDto.stateCode;
    address.city = shippingAndBillingAddressDto.city;
    address.phone = shippingAndBillingAddressDto.phone;
    address.created_by = user.id;
    address.updated_by = user.id;

    return address; // this is faster
    return this.addressRepository.create({
      addressLine1: shippingAndBillingAddressDto.addressLine1,
      addressLine2: shippingAndBillingAddressDto.addressLine2,
      countryCode: shippingAndBillingAddressDto.countryCode,
      pincode: shippingAndBillingAddressDto.pincode,
      stateCode: shippingAndBillingAddressDto.stateCode,
      city: shippingAndBillingAddressDto.city,
      phone: shippingAndBillingAddressDto.phone,
      created_by: user.id,
      updated_by: user.id,
    });
  }

  async updateVendor(
    createVendorBodyDto: CreateVendorBodyDto,
    user: User,
  ): Promise<vendorType> {
    // update vendor fields.
    const partyContacts = createVendorBodyDto?.partyContacts;
    const contact_name = partyContacts[0].name;
    const email = partyContacts[0].email;
    const mobile = partyContacts[0].phone;
    const code = createVendorBodyDto.code;
    const shippingAddressId = createVendorBodyDto.shippingAddress;
    const billingAddressId = createVendorBodyDto.billingAddress;
    const sameAsShipping = createVendorBodyDto.sameAsShipping;

    delete createVendorBodyDto?.partyContacts;
    delete createVendorBodyDto?.shippingAddress;
    delete createVendorBodyDto?.billingAddress;
    delete createVendorBodyDto?.sameAsShipping;

    const vendor = await this.vendorRepository.findOne({
      where: { code: code },
      relations: {
        shippingAddressId: true,
        billingAddressId: true,
      },
    });

    vendor.shippingAddressId = {
      ...vendor.shippingAddressId,
      ...shippingAddressId,
    };

    if (
      sameAsShipping == false &&
      vendor.shippingAddressId.id === vendor.billingAddressId.id
    ) {
      vendor.billingAddressId = this.addressRepository.create({
        ...billingAddressId,
        created_by: user.id,
        updated_by: user.id,
      });
    } else if (
      sameAsShipping == true &&
      vendor.shippingAddressId.id !== vendor.billingAddressId.id
    ) {
      vendor.billingAddressId = {
        ...vendor.shippingAddressId,
        ...shippingAddressId,
      };
    } else {
      vendor.billingAddressId = {
        ...vendor.billingAddressId,
        ...billingAddressId,
      };
    }

    await this.vendorRepository.save({
      ...vendor,
      ...createVendorBodyDto,
      contact_name,
      email,
      mobile,
    });

    // await this.entityManagerMaster.transaction(
    //   async (transactionalEntityManager: EntityManager) => {
    //     const billAddressId = await this.updateVendorAddress(
    //       transactionalEntityManager,
    //       code,
    //       shippingAddressId,
    //       billingAddressId,
    //       user,
    //       sameAsShipping,
    //     );

    //     await transactionalEntityManager.update(
    //       Vendor,
    //       {
    //         code: code,
    //       },        VendorCatalog,

    //       { ...vendorData, billingAddressId: billAddressId },
    //     );
    //   },
    // );
    return { message: 'vendor updated successfully' };
  }

  async updateVendorAddress(
    code: string,
    shippingAddress: ShippingAndBillingAddressDto,
    billingAddress: ShippingAndBillingAddressDto,
    user: User,
    sameAsShipping: boolean = false,
  ): Promise<Addresses> {
    const createdBy = user.id;

    const currentAddresses = await this.vendorRepository.findOne({
      where: { code: code, created_by: createdBy },
      select: ['billingAddressId', 'shippingAddressId'],
    });

    const shipAddressId = currentAddresses
      ? currentAddresses.shippingAddressId
      : null;
    let billAddressId = currentAddresses
      ? currentAddresses.billingAddressId
      : null;
    const initallyDiffAddressIds = shipAddressId != billAddressId;
    const toBeDropped = billAddressId;
    let sameAddressIdsAfterUpdation = false;
    //update shippinAddress
    if (shippingAddress && shipAddressId) {
      await this.addressRepository.update(
        { id: shipAddressId.id, created_by: createdBy },
        {
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || null,
          countryCode: shippingAddress.countryCode,
          pincode: shippingAddress.pincode,
          stateCode: shippingAddress.stateCode,
          city: shippingAddress.city,
          phone: shippingAddress.phone,
        },
      );
    }
    if (sameAsShipping) {
      billAddressId = shipAddressId;
      sameAddressIdsAfterUpdation = true;
    } else if (billingAddress && !sameAsShipping) {
      billAddressId = this.storeVendorAddress(billingAddress, user);
    }
    if (initallyDiffAddressIds && sameAddressIdsAfterUpdation) {
      //update
      this.addressRepository.update({ id: toBeDropped.id }, { status: '0' });
    }
    return billAddressId;
  }

  async createVendorCatalog(
    vendorCatalogBodyDto: VendorCatalogBodyDto,
    user: User,
  ): Promise<vendorType> {
    const vendorCode = vendorCatalogBodyDto.vendorCode;
    const itemTypeSkuCode = vendorCatalogBodyDto.itemTypeSkuCode;
    const vendorSkuCode = vendorCatalogBodyDto.vendorSkuCode;
    const unitPrice = vendorCatalogBodyDto.unitPrice;
    const updatedBy = user.id;
    const createdBy = user.id;

    const vendor = await this.vendorRepository.findOne({
      where: { code: vendorCode },
      select: ['id'],
    });
    if (!vendor) {
      throw new BadRequestException('Vendor not found');
    }

    const product = await this.productRepository.findOne({
      where: [{ id: itemTypeSkuCode.slice(-4) }, { sku_code: itemTypeSkuCode }],
      select: ['id', 'name'],
    });

    if (!product) {
      throw new BadRequestException(`Product of ${itemTypeSkuCode} not exist`);
    }
    const productName = product.name;
    const productId = product.id;
    const vendorId = vendor.id;
    // const isExist = await this.catalogRepository.findOne({
    //   where: {
    //     vendor_id: vendorId,
    //     created_by: createdBy,
    //     product_sku_code: itemTypeSkuCode,
    //   },
    //   select: ['id'],
    // });
    // if (isExist) {
    //   //update
    //   await this.catalogRepository.update(
    //     {
    //       id: isExist.id,
    //     },
    //     {
    //       product_sku_code: itemTypeSkuCode,
    //       product_id: productId,
    //       product_name: productName,
    //       unitPrice: unitPrice,
    //       updated_by: updatedBy,
    //       created_by: createdBy,
    //     },
    //   );
    // } else {
    //   await this.catalogRepository.insert({
    //     vendor_id: vendorId,
    //     product_sku_code: itemTypeSkuCode,
    //     product_id: productId,
    //     product_name: productName,
    //     unitPrice: unitPrice,
    //     updated_by: updatedBy,
    //     created_by: createdBy,
    //   });
    // }

    await this.catalogRepository.save({
      vendor_id: vendorId,
      product_sku_code: itemTypeSkuCode,
      product_id: productId,
      product_name: productName,
      unit_price: unitPrice,
      updated_by: updatedBy,
      created_by: createdBy,
    });

    return { message: 'vendor catalog created successfully' };
  }
}
